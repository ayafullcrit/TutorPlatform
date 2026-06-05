import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSubjects } from "../../services/subjectService";

// SubjectResponse từ backend: { id, name, description, isActive, displayOrder, totalClasses }
// Trang này chỉ xem danh sách môn học từ hệ thống (backend chỉ có GET)
// Không có tính năng thêm/sửa/xóa subject từ phía gia sư

export default function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllSubjects();
      // ApiResponse<List<SubjectResponse>>: { success, data: [...] }
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

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount   = subjects.filter((s) => s.isActive).length;
  const inactiveCount = subjects.filter((s) => !s.isActive).length;

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
          <button onClick={loadSubjects} style={{ marginLeft: 12, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "#c62828" }}>
            Thử lại
          </button>
        </div>
      )}

      {/* Summary */}
      <section className="tutor-subjects__summary">
        <div className="tutor-card tutor-subjects__summary-card">
          <p>Tổng môn học trên hệ thống </p>
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
          <h3>{subjects.reduce((sum, s) => sum + (s.totalClasses ?? 0), 0)}</h3>
        </div>
      </section>

      {/* Panel */}
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
                </div>

                <h3 className="tutor-subject-card__name">{subject.name}</h3>
                <p className="tutor-subject-card__desc">{subject.description}</p>

                <div className="tutor-subject-card__info">
                  <div>
                    <span>Môn đang mở</span>
                    <strong>{subject.totalClasses ?? 0}</strong>
                  </div>
                </div>

                {/* Gợi ý tạo môn dạy */}
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
    </div>
  );
}