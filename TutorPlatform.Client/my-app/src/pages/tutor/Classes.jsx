import { useState, useEffect } from "react";
import TutorClassCard from "../../components/tutor/TutorClassCard";
import { getMyClasses, createClass, updateClass, deleteClass } from "../../services/classService";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMyClasses();
      if (result.data) {
        setClasses(result.data);
      }
    } catch (err) {
      console.error("Failed to load classes:", err);
      setError("Không thể tải lớp học");
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses =
    statusFilter === "all"
      ? classes
      : classes.filter((item) => item.status === statusFilter);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const form = e.target;

      const classData = {
        name: form.title.value,
        subject: form.subject.value,
        schedule: form.time.value,
        type: "online",
        status: "active",
      };

      const result = await createClass(classData);
      if (result.data) {
        setClasses([result.data, ...classes]);
        setIsCreateOpen(false);
        form.reset();
      }
    } catch (err) {
      console.error("Failed to create class:", err);
      setError("Không thể tạo lớp học");
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Bạn có chắc muốn xóa lớp học này?")) return;

    try {
      await deleteClass(classId);
      setClasses(classes.filter((c) => c.id !== classId));
    } catch (err) {
      console.error("Failed to delete class:", err);
      setError("Không thể xóa lớp học");
    }
  };

  return (
    <div>
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Quản lý lớp học</h1>
          <p className="tutor-page__subtitle">
            Bạn đang có {classes.length} lớp học đang hoạt động và chờ mở.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <select
            className="tutor-btn tutor-btn--ghost"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang học</option>
            <option value="inactive">Chờ mở lớp</option>
          </select>

          <button
            className="tutor-btn tutor-btn--primary"
            onClick={() => setIsCreateOpen(true)}
          >
            Tạo lớp mới
          </button>
        </div>
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

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Đang tải lớp học...</div>
      ) : (
        <div className="tutor-classes__grid">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((item) => (
              <TutorClassCard
                key={item.id}
                item={item}
                onViewDetail={() => setSelectedClass(item)}
                onDelete={() => handleDeleteClass(item.id)}
              />
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "#999" }}>
              Không có lớp học nào
            </div>
          )}
        </div>
      )}

      {isCreateOpen && (
        <div className="tutor-modal">
          <div className="tutor-modal__content">
            <h2>Tạo lớp mới</h2>

            <form onSubmit={handleCreateClass}>
              <label>Tên lớp</label>
              <input name="title" required placeholder="VD: Toán Lý 12A" />

              <label>Môn học</label>
              <input name="subject" required placeholder="VD: Toán & Vật Lý" />

              <label>Thời gian học</label>
              <input name="time" required placeholder="VD: T2, T4 - 19:30" />

              <div className="tutor-modal__actions">
                <button
                  type="button"
                  className="tutor-btn tutor-btn--ghost"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Hủy
                </button>

                <button type="submit" className="tutor-btn tutor-btn--primary">
                  Tạo lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedClass && (
        <div className="tutor-modal">
          <div className="tutor-modal__content">
            <h2>{selectedClass.name}</h2>
            <p><strong>Môn học:</strong> {selectedClass.subject}</p>
            <p><strong>Thời gian:</strong> {selectedClass.schedule}</p>
            <p><strong>Trạng thái:</strong> {selectedClass.status}</p>

            <div className="tutor-modal__actions">
              <button
                className="tutor-btn tutor-btn--ghost"
                onClick={() => setSelectedClass(null)}
              >
                Hủy
              </button>
              <button
                className="tutor-btn tutor-btn--primary"
                onClick={() => {
                  handleDeleteClass(selectedClass.id);
                  setSelectedClass(null);
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}