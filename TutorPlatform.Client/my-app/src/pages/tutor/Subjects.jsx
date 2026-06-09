import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import { getAllSubjects, updateSubject } from "../../services/subjectService";

export default function Subjects() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", isActive: true });
  const [isSaving, setIsSaving] = useState(false);

  const canEditSubjects = currentUser?.role === 2 || currentUser?.role === 3;

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllSubjects();

      if (result?.success && result.data) {
        setSubjects(result.data);
      } else {
        setError(result?.message || "Không thể tải danh sách môn học");
      }
    } catch (err) {
      console.error("Failed to load subjects:", err);
      setError("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (subject) => {
    setError(null);
    setSuccessMessage("");
    setEditingSubject(subject);
    setEditForm({
      name: subject.name ?? "",
      description: subject.description ?? "",
      isActive: Boolean(subject.isActive),
    });
  };

  const closeEditModal = () => {
    if (isSaving) return;
    setEditingSubject(null);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    if (!editingSubject) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage("");

      const payload = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        isActive: editForm.isActive,
      };

      const result = await updateSubject(editingSubject.id, payload);
      if (result?.success && result.data) {
        setSubjects((prev) =>
          prev.map((subject) =>
            subject.id === editingSubject.id
              ? {
                  ...subject,
                  name: result.data.name,
                  description: result.data.description,
                  isActive: result.data.isActive,
                }
              : subject
          )
        );
        setSuccessMessage("Cập nhật môn học thành công.");
        setEditingSubject(null);
      } else {
        setError(result?.message || "Không thể cập nhật môn học");
      }
    } catch (err) {
      console.error("Failed to update subject:", err);
      setError(err.response?.data?.message || "Không thể cập nhật môn học");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    (subject.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = subjects.filter((subject) => subject.isActive).length;
  const inactiveCount = subjects.filter((subject) => !subject.isActive).length;

  return (
    <div className="tutor-subjects">
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Danh sách môn học</h1>
          <p className="tutor-page__subtitle">
            Các môn học hiện có trên hệ thống. Tạo môn dạy để bắt đầu giảng dạy.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ padding: "12px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "4px", marginBottom: "20px" }}>
          {error}
          <button
            onClick={loadSubjects}
            style={{ marginLeft: 12, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "#c62828" }}
          >
            Thử lại
          </button>
        </div>
      )}

      {successMessage && (
        <div style={{ padding: "12px", backgroundColor: "#e8f5e9", color: "#2e7d32", borderRadius: "4px", marginBottom: "20px" }}>
          {successMessage}
        </div>
      )}

      <section className="tutor-subjects__summary">
        <div className="tutor-card tutor-subjects__summary-card">
          <p>Tổng môn học trên hệ thống</p>
          <h3>{subjects.length}</h3>
        </div>
        <div className="tutor-card tutor-subjects__summary-card">
          <p>Đang hoạt động</p>
          <h3>{activeCount}</h3>
        </div>
        <div className="tutor-card tutor-subjects__summary-card">
          <p>Không hoạt động</p>
          <h3>{inactiveCount}</h3>
        </div>
        <div className="tutor-card tutor-subjects__summary-card">
          <p>Tổng môn học đang dạy</p>
          <h3>{subjects.reduce((sum, subject) => sum + (subject.totalClasses ?? 0), 0)}</h3>
        </div>
      </section>

      <section className="tutor-card tutor-subjects__panel">
        <div className="tutor-subjects__toolbar">
          <div className="tutor-subjects__search">
            <span className="material-symbols-outlined">search</span>
            <input
              placeholder="Tìm môn học hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Đang tải môn học...</div>
        ) : filteredSubjects.length === 0 ? (
          <div className="tutor-subjects__empty">
            <span className="material-symbols-outlined">search_off</span>
            <h3>Không tìm thấy môn học phù hợp</h3>
            <p>Hãy thử thay đổi từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="tutor-subjects__grid">
            {filteredSubjects.map((subject) => (
              <article key={subject.id} className="tutor-subject-card">
                <div className="tutor-subject-card__top">
                  <span className={`tutor-badge ${subject.isActive ? "tutor-badge--active" : "tutor-badge--pending"}`}>
                    {subject.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                  {canEditSubjects && (
                    <button
                      type="button"
                      className="tutor-subject-card__icon-btn"
                      onClick={() => openEditModal(subject)}
                      aria-label={`Chỉnh sửa ${subject.name}`}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  )}
                </div>

                <h3 className="tutor-subject-card__name">{subject.name}</h3>
                <p className="tutor-subject-card__desc">{subject.description || "Chưa có mô tả cho môn học này."}</p>

                <div className="tutor-subject-card__info">
                  <div>
                    <span>Môn đang mở</span>
                    <strong>{subject.totalClasses ?? 0}</strong>
                  </div>
                </div>

                <div className="tutor-subject-card__actions">
                  <button
                    className="tutor-btn tutor-btn--primary"
                    style={{ width: "100%", fontSize: 13 }}
                    onClick={() => navigate("/tutor/classes", { state: { createClass: true, subjectId: subject.id } })}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                    Tạo môn dạy này
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {editingSubject && (
        <div className="tutor-modal" onClick={closeEditModal}>
          <div className="tutor-modal__content" onClick={(e) => e.stopPropagation()}>
            <h2>Chỉnh sửa môn học</h2>
            <form onSubmit={handleUpdateSubject}>
              <label htmlFor="subject-name">Tên môn học</label>
              <input
                id="subject-name"
                value={editForm.name}
                maxLength={80}
                required
                onChange={(e) => handleEditFormChange("name", e.target.value)}
                placeholder="VD: Toán học"
              />

              <label htmlFor="subject-description">Mô tả</label>
              <textarea
                id="subject-description"
                rows={4}
                maxLength={500}
                value={editForm.description}
                onChange={(e) => handleEditFormChange("description", e.target.value)}
                placeholder="Mô tả ngắn về môn học"
              />

              <label htmlFor="subject-status">Trạng thái</label>
              <select
                id="subject-status"
                value={editForm.isActive ? "active" : "inactive"}
                onChange={(e) => handleEditFormChange("isActive", e.target.value === "active")}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>

              <div className="tutor-modal__actions">
                <button type="button" className="tutor-btn tutor-btn--ghost" onClick={closeEditModal} disabled={isSaving}>
                  Hủy
                </button>
                <button type="submit" className="tutor-btn tutor-btn--primary" disabled={isSaving}>
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
