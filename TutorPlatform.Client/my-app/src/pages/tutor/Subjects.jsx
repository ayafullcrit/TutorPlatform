import { useMemo, useState, useEffect } from "react";
import { getAllSubjects, createSubject, updateSubject, deleteSubject } from "../../services/subjectService";

const emptyForm = {
  name: "",
  level: "",
  price: "",
  description: "",
  status: "active",
};

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllSubjects();
      if (result) {
        setSubjects(result);
      }
    } catch (err) {
      console.error("Failed to load subjects:", err);
      setError("Không thể tải danh sách môn học");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const keyword = searchTerm.toLowerCase();

      const matchSearch =
        subject.name.toLowerCase().includes(keyword) ||
        subject.level.toLowerCase().includes(keyword) ||
        subject.description.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "all" || subject.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [subjects, searchTerm, statusFilter]);

  const formatCurrency = (value) => {
    return Number(value).toLocaleString("vi-VN") + "đ";
  };

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      level: subject.level,
      price: subject.price,
      description: subject.description,
      status: subject.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanData = {
        ...formData,
        price: Number(formData.price),
      };

      if (editingSubject) {
        const result = await updateSubject(editingSubject.id, cleanData);
        if (result.data) {
          setSubjects((prev) =>
            prev.map((subject) =>
              subject.id === editingSubject.id
                ? { ...subject, ...cleanData }
                : subject
            )
          );
        }
      } else {
        const result = await createSubject(cleanData);
        if (result.data) {
          setSubjects((prev) => [result.data, ...prev]);
        }
      }

      closeModal();
    } catch (err) {
      console.error("Failed to save subject:", err);
      setError("Không thể lưu môn học");
    }
  };

  const handleDelete = async (subjectId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa môn học này?");

    if (!confirmDelete) return;

    try {
      await deleteSubject(subjectId);
      setSubjects((prev) => prev.filter((subject) => subject.id !== subjectId));
    } catch (err) {
      console.error("Failed to delete subject:", err);
      setError("Không thể xóa môn học");
    }
  };

  const toggleStatus = async (subjectId) => {
    try {
      const subject = subjects.find(s => s.id === subjectId);
      if (!subject) return;

      const newStatus = subject.status === "active" ? "inactive" : "active";
      const result = await updateSubject(subjectId, { status: newStatus });
      
      if (result.data) {
        setSubjects((prev) =>
          prev.map((item) =>
            item.id === subjectId
              ? { ...item, status: newStatus }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle subject status:", err);
      setError("Không thể đổi trạng thái môn học");
    }
  };

  return (
    <div className="tutor-subjects">
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Quản lý môn học</h1>
          <p className="tutor-page__subtitle">
            Thêm, cập nhật học phí và quản lý các môn học bạn đang giảng dạy.
          </p>
        </div>

        <button className="tutor-btn tutor-btn--primary" onClick={openCreateModal}>
          <span className="material-symbols-outlined">add</span>
          Thêm môn học
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: "12px", 
          backgroundColor: "#ffebee", 
          color: "#c62828",
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          {error}
        </div>
      )}

      <section className="tutor-subjects__summary">
        <div className="tutor-card tutor-subjects__summary-card">
          <p>Tổng môn học</p>
          <h3>{subjects.length}</h3>
        </div>

        <div className="tutor-card tutor-subjects__summary-card">
          <p>Đang dạy</p>
          <h3>{subjects.filter((item) => item.status === "active").length}</h3>
        </div>

        <div className="tutor-card tutor-subjects__summary-card">
          <p>Tạm ẩn</p>
          <h3>{subjects.filter((item) => item.status !== "active").length}</h3>
        </div>

        <div className="tutor-card tutor-subjects__summary-card">
          <p>Tổng học viên</p>
          <h3>
            {subjects.reduce((sum, item) => sum + Number(item.totalStudents || 0), 0)}
          </h3>
        </div>
      </section>

      <section className="tutor-card tutor-subjects__panel">
        <div className="tutor-subjects__toolbar">
          <div className="tutor-subjects__search">
            <span className="material-symbols-outlined">search</span>
            <input
              placeholder="Tìm môn học, cấp độ hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="tutor-subjects__filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang dạy</option>
            <option value="inactive">Tạm ẩn</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Đang tải môn học...</div>
        ) : filteredSubjects.length === 0 ? (
          <div className="tutor-subjects__empty">
            <span className="material-symbols-outlined">search_off</span>
            <h3>Không tìm thấy môn học phù hợp</h3>
            <p>Hãy thử thay đổi từ khóa hoặc bộ lọc trạng thái.</p>
          </div>
        ) : (
          <div className="tutor-subjects__grid">
            {filteredSubjects.map((subject) => (
              <article key={subject.id} className="tutor-subject-card">
                <div className="tutor-subject-card__top">
                  <span
                    className={`tutor-badge ${
                      subject.status === "active"
                        ? "tutor-badge--active"
                        : "tutor-badge--pending"
                    }`}
                  >
                    {subject.status === "active" ? "Đang dạy" : "Tạm ẩn"}
                  </span>

                  <button
                    className="tutor-subject-card__icon-btn"
                    onClick={() => toggleStatus(subject.id)}
                    title="Đổi trạng thái"
                  >
                    <span className="material-symbols-outlined">
                      {subject.status === "active" ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>

                <p className="tutor-subject-card__level">{subject.level}</p>
                <h3 className="tutor-subject-card__name">{subject.name}</h3>

                <p className="tutor-subject-card__desc">
                  {subject.description}
                </p>

                <div className="tutor-subject-card__info">
                  <div>
                    <span>Học phí</span>
                    <strong>{formatCurrency(subject.price)} / giờ</strong>
                  </div>

                  <div>
                    <span>Học viên</span>
                    <strong>{subject.totalStudents || 0}</strong>
                  </div>
                </div>

                <div className="tutor-subject-card__actions">
                  <button
                    className="tutor-btn tutor-btn--ghost"
                    onClick={() => openEditModal(subject)}
                  >
                    Sửa
                  </button>

                  <button
                    className="tutor-btn tutor-btn--danger"
                    onClick={() => handleDelete(subject.id)}
                  >
                    Xóa
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="tutor-modal">
          <div className="tutor-modal__content">
            <h2>{editingSubject ? "Cập nhật môn học" : "Thêm môn học mới"}</h2>

            <form onSubmit={handleSubmit}>
              <label>Tên môn học</label>
              <input
                name="name"
                required
                placeholder="VD: Toán lớp 12"
                value={formData.name}
                onChange={handleChange}
              />

              <label>Cấp độ / Nhóm môn</label>
              <input
                name="level"
                required
                placeholder="VD: THPT, IELTS, Beginner"
                value={formData.level}
                onChange={handleChange}
              />

              <label>Học phí / giờ</label>
              <input
                name="price"
                type="number"
                min="0"
                required
                placeholder="VD: 200000"
                value={formData.price}
                onChange={handleChange}
              />

              <label>Mô tả môn học</label>
              <textarea
                name="description"
                required
                rows="4"
                placeholder="Mô tả nội dung giảng dạy, đối tượng học viên, mục tiêu..."
                value={formData.description}
                onChange={handleChange}
              />

              <label>Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Đang dạy</option>
                <option value="hidden">Tạm ẩn</option>
              </select>

              <div className="tutor-modal__actions">
                <button
                  type="button"
                  className="tutor-btn tutor-btn--ghost"
                  onClick={closeModal}
                >
                  Hủy
                </button>

                <button type="submit" className="tutor-btn tutor-btn--primary">
                  {editingSubject ? "Lưu thay đổi" : "Thêm môn học"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}