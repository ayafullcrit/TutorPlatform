import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TutorClassCard from "../../components/tutor/TutorClassCard";
import { getCurrentUser, getCurrentUserApi } from "../../services/authService";
import { getMyClasses, createClass, deleteClass, updateClass } from "../../services/classService";
import { getAllSubjects } from "../../services/subjectService";

const CLASS_STATUS_TEXT = { 1: "Nháp", 2: "Đang học", 3: "Hoàn thành", 4: "Đã hủy", 5: "Không hoạt động" };

const getInitialEditForm = () => ({
  subjectId: "",
  title: "",
  description: "",
  grade: 1,
  pricePerSession: "",
  durationMinutes: "",
  totalSessions: "",
  maxStudents: "",
  status: 2,
});

export default function Classes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editForm, setEditForm] = useState(getInitialEditForm());
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [preselectedSubjectId, setPreselectedSubjectId] = useState("");

  const isVerified = Boolean(user?.isTutorVerified);

  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      try {
        const result = await getCurrentUserApi();
        const currentUser = result?.data;
        if (!mounted || !currentUser) return;

        localStorage.setItem("user", JSON.stringify(currentUser));
        setUser(currentUser);
      } catch {
        // Keep local fallback if API unavailable
      }
    };

    loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isVerified) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerified]);

  useEffect(() => {
    if (location.state?.createClass && isVerified) {
      setIsCreateOpen(true);
      if (location.state?.subjectId) {
        setPreselectedSubjectId(location.state.subjectId.toString());
      }
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate, isVerified]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [classResult, subjectResult] = await Promise.all([getMyClasses(), getAllSubjects()]);

      if (classResult?.success && classResult.data) {
        setClasses(classResult.data);
      }
      if (subjectResult?.success && subjectResult.data) {
        setSubjects(subjectResult.data);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses =
    statusFilter === "all" ? classes : classes.filter((c) => c.status === parseInt(statusFilter, 10));

  const handleCreateClass = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      setError(null);
      setSuccessMessage("");

      const classData = {
        subjectId: parseInt(form.subjectId.value, 10),
        title: form.title.value,
        description: form.description.value,
        gradeLevel: parseInt(form.gradeLevel.value, 10),
        thumbnailUrl: "",
        pricePerSession: parseFloat(form.pricePerSession.value),
        durationMinutes: parseInt(form.durationMinutes.value),
        sessionsPerWeek: parseInt(form.sessionsPerWeek.value),
        maxStudents: parseInt(form.maxStudents.value),

      };

      const result = await createClass(classData);
      if (result?.success && result.data) {
        setClasses([result.data, ...classes]);
        setSuccessMessage("Tạo môn dạy thành công.");
        setIsCreateOpen(false);
        setPreselectedSubjectId("");
        form.reset();
      } else {
        setError(result?.message || "Không thể tạo lớp học");
      }
    } catch (err) {
      console.error("Failed to create class:", err);
      setError(err.response?.data?.message || "Không thể tạo lớp học");
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Bạn có chắc muốn xóa lớp học này?")) return;
    try {
      await deleteClass(classId);
      setClasses(classes.filter((c) => c.id !== classId));
      setSelectedClass(null);
      setEditingClass(null);
      setSuccessMessage("Đã xóa môn dạy.");
    } catch (err) {
      console.error("Failed to delete class:", err);
      setError("Không thể xóa lớp học");
    }
  };

  const openEditModal = (classItem) => {
    setError(null);
    setSuccessMessage("");
    setSelectedClass(null);
    setEditingClass(classItem);
    setEditForm({
      subjectId: classItem.subjectId?.toString() ?? "",
      title: classItem.title ?? "",
      description: classItem.description ?? "",
      grade: classItem.grade ?? 1,
      pricePerSession: classItem.pricePerSession ?? "",
      durationMinutes: classItem.durationMinutes ?? "",
      totalSessions: classItem.totalSessions ?? "",
      maxStudents: classItem.maxStudents ?? "",
      status: classItem.status ?? 2,
    });
  };

  const closeEditModal = () => {
    if (isSavingEdit) return;
    setEditingClass(null);
    setEditForm(getInitialEditForm());
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    if (!editingClass) return;

    try {
      setIsSavingEdit(true);
      setError(null);
      setSuccessMessage("");

      const payload = {
        subjectId: parseInt(editForm.subjectId, 10),
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        thumbnailUrl: editingClass.thumbnailUrl ?? "",
        pricePerSession: parseFloat(editForm.pricePerSession),
        durationMinutes: parseInt(editForm.durationMinutes, 10),
        totalSessions: parseInt(editForm.totalSessions, 10),
        maxStudents: parseInt(editForm.maxStudents, 10),
        status: parseInt(editForm.status, 10),
      };

      const result = await updateClass(editingClass.id, payload);
      if (result?.success && result.data) {
        setClasses((prev) => prev.map((item) => (item.id === editingClass.id ? result.data : item)));
        setSuccessMessage("Cập nhật môn dạy thành công.");
        closeEditModal();
      } else {
        setError(result?.message || "Không thể cập nhật môn dạy");
      }
    } catch (err) {
      console.error("Failed to update class:", err);
      setError(err.response?.data?.message || "Không thể cập nhật môn dạy");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const mapClassToCardItem = (c) => ({
    ...c,
    subject: c.subjectName,
    status: c.status === 2 ? "active" : "inactive",
    students: `${c.currentStudents}/${c.maxStudents} học viên`,
    time: `${c.durationMinutes} phút/buổi · ${c.sessionsPerWeek ?? 1} buổi/tuần`,
be341c0a3b3a02a184397c3a194377ea2c
  });

  if (!isVerified) {
    return (
      <div className="tutor-page__pending">
        <div className="tutor-page__pending-card">
          <span className="material-symbols-outlined tutor-page__pending-icon">pending_actions</span>
          <h1>Chức năng đang chờ duyệt</h1>
          <p>Bạn phải chờ admin duyệt tài khoản gia sư trước khi sử dụng chức năng này.</p>

          <div className="tutor-page__pending-actions">
            <button className="tutor-btn tutor-btn--primary" onClick={() => navigate("/tutor/dashboard")}>
              Về trang tổng quan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Quản lý môn dạy</h1>
          <p className="tutor-page__subtitle">
            Bạn đang có {classes.filter((c) => c.status === 2).length} môn dạy đang hoạt động.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <select
            className="tutor-btn tutor-btn--ghost"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="2">Đang học</option>
            <option value="1">Nháp</option>
            <option value="5">Không hoạt động</option>
          </select>

          <button className="tutor-btn tutor-btn--primary" onClick={() => setIsCreateOpen(true)}>
            Tạo môn dạy mới
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {successMessage}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Đang tải môn dạy...</div>
      ) : (
        <div className="tutor-classes__grid">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((item) => (
              <TutorClassCard
                key={item.id}
                item={mapClassToCardItem(item)}
                onViewDetail={() => setSelectedClass(item)}
                onEdit={() => openEditModal(item)}
              />
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "#999" }}>
              Không có môn dạy nào
            </div>
          )}
        </div>
      )}

      {isCreateOpen && (
        <div className="tutor-modal">
          <div className="tutor-modal__content">
            <h2>Tạo môn dạy mới</h2>
            <form onSubmit={handleCreateClass}>
              <label>Môn học</label>
              <select
                name="subjectId"
                required
                value={preselectedSubjectId}
                onChange={(e) => setPreselectedSubjectId(e.target.value)}
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <label>Tiêu đề môn dạy</label>
              <input name="title" required placeholder="VD: Toán lớp 12 - Đại số" />

              <label>Mô tả</label>
              <textarea name="description" rows={3} placeholder="Nội dung và mục tiêu môn học..." />

              <label>Khối lớp (1-12)</label>
              <select name="gradeLevel" required>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    Lớp {g}
                  </option>
                ))}
              </select>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>Giá/buổi (VNĐ)</label>
                  <input name="pricePerSession" type="number" min="0" required placeholder="VD: 150000" />
                </div>
                <div>
                  <label>Thời lượng (phút)</label>
                  <input name="durationMinutes" type="number" min="30" required placeholder="VD: 90" />
                </div>
                <div>
                  <label>Số buổi/tuần</label>
                  <input name="sessionsPerWeek" type="number" min="1" max="7" required placeholder="VD: 3" />

                </div>
                <div>
                  <label>Học viên tối đa</label>
                  <input name="maxStudents" type="number" min="1" max="50" required placeholder="VD: 10" />
                </div>
              </div>

              <div className="tutor-modal__actions">
                <button
                  type="button"
                  className="tutor-btn tutor-btn--ghost"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setPreselectedSubjectId("");
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className="tutor-btn tutor-btn--primary">
                  Tạo môn dạy mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingClass && (
        <div className="tutor-modal" onClick={closeEditModal}>
          <div className="tutor-modal__content" onClick={(e) => e.stopPropagation()}>
            <h2>Chỉnh sửa môn dạy</h2>
            <form onSubmit={handleUpdateClass}>
              <label>Môn học</label>
              <select
                value={editForm.subjectId}
                onChange={(e) => handleEditFormChange("subjectId", e.target.value)}
                required
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>

              <label>Tiêu đề môn dạy</label>
              <input
                value={editForm.title}
                onChange={(e) => handleEditFormChange("title", e.target.value)}
                required
                placeholder="VD: Toán lớp 12 - Đại số"
              />

              <label>Mô tả</label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => handleEditFormChange("description", e.target.value)}
                placeholder="Nội dung và mục tiêu môn học..."
              />

              <label>Trạng thái</label>
              <select value={editForm.status} onChange={(e) => handleEditFormChange("status", e.target.value)}>
                <option value={2}>Đang học</option>
                <option value={1}>Nháp</option>
                <option value={5}>Không hoạt động</option>
                <option value={3}>Hoàn thành</option>
                <option value={4}>Đã hủy</option>
              </select>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>Khối lớp</label>
                  <input value={`Lớp ${editForm.grade}`} disabled />
                </div>
                <div>
                  <label>Giá/buổi (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.pricePerSession}
                    onChange={(e) => handleEditFormChange("pricePerSession", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Thời lượng (phút)</label>
                  <input
                    type="number"
                    min="30"
                    value={editForm.durationMinutes}
                    onChange={(e) => handleEditFormChange("durationMinutes", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Tổng số buổi / tuần</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={editForm.totalSessions}
                    onChange={(e) => handleEditFormChange("totalSessions", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Học viên tối đa</label>
                  <input
                    type="number"
                    min={editingClass.currentStudents || 1}
                    max="50"
                    value={editForm.maxStudents}
                    onChange={(e) => handleEditFormChange("maxStudents", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="tutor-modal__actions">
                <button type="button" className="tutor-btn tutor-btn--ghost" onClick={closeEditModal} disabled={isSavingEdit}>
                  Hủy
                </button>
                <button type="submit" className="tutor-btn tutor-btn--primary" disabled={isSavingEdit}>
                  {isSavingEdit ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedClass && (
        <div className="tutor-modal">
          <div className="tutor-modal__content">
            <h2>{selectedClass.title}</h2>
            <p><strong>Môn học:</strong> {selectedClass.subjectName}</p>
            <p><strong>Khối lớp:</strong> {selectedClass.grade}</p>
            <p><strong>Giá/buổi:</strong> {selectedClass.pricePerSession?.toLocaleString("vi-VN")} VNĐ</p>
            <p><strong>Thời lượng:</strong> {selectedClass.durationMinutes} phút</p>
            <p><strong>Học viên:</strong> {selectedClass.currentStudents}/{selectedClass.maxStudents}</p>
            <p><strong>Trạng thái:</strong> {CLASS_STATUS_TEXT[selectedClass.status] ?? selectedClass.statusText}</p>

            <div className="tutor-modal__actions">
              <button className="tutor-btn tutor-btn--ghost" onClick={() => setSelectedClass(null)}>
                Đóng
              </button>
              <button className="tutor-btn tutor-btn--primary" onClick={() => openEditModal(selectedClass)}>
                Chỉnh sửa
              </button>
              <button className="tutor-btn tutor-btn--danger" onClick={() => handleDeleteClass(selectedClass.id)}>
                Xóa môn dạy này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
