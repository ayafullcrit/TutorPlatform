import { useEffect, useState } from "react";
import TutorCardSkeleton from "../../components/student/TutorCardSkeleton";
import EmptyState from "../../components/student/EmptyState";
import ErrorState from "../../components/student/ErrorState";
import { searchClasses } from "../../services/classService";
import { getAllSubjects } from "../../services/subjectService";
import { enrollClass } from "../../services/bookingService";

const provinces = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre",
  "Bình Dương", "Bình Định", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng",
  "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai",
  "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang",
  "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng",
  "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận",
  "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
  "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế",
  "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái",
];

export default function FindTutor() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filters, setFilters] = useState({
    keyword: "",
    subjectId: "",
    grade: "",
    address: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "price",
    sortOrder: "asc",
    page: 1,
    pageSize: 20,
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [bookingForm, setBookingForm] = useState({ note: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadSubjects = async () => {
    try {
      const result = await getAllSubjects();
      if (result?.success && result.data) setSubjects(result.data);
    } catch {}
  };

  const loadClasses = async () => {
    setStatus("loading");
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "" && value !== null && value !== undefined)
      );

      const result = await searchClasses(params);
      if (result?.success && result.data) {
        const items = result.data.items ?? [];
        setClasses(items);
        setStatus(items.length === 0 ? "empty" : "success");
      } else {
        setStatus("empty");
      }
    } catch (error) {
      console.error("Failed to load classes:", error);
      setStatus("error");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const openBookingModal = (cls) => {
    setSelectedClass(cls);
    setBookingForm({ note: "" });
    setShowModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;

    try {
      setIsSubmitting(true);
      const result = await enrollClass({
        classId: selectedClass.id,
        note: bookingForm.note,
      });

      if (result.success) {
        alert(result.message || "Đăng ký lớp thành công!");
        setShowModal(false);
        loadClasses();
      } else {
        alert(result.message || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi kết nối đến máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="student-find-tutor">
      <div className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Tìm gia sư</h1>
          <p className="student-dashboard__subtext">
            Tìm kiếm theo từ khóa, môn học, khối lớp và thêm lọc theo tỉnh/thành.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo từ khóa..."
          value={filters.keyword}
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
          style={{ flex: "1 1 200px", padding: "8px 14px", borderRadius: 999, border: "1px solid #d1c9b4", background: "#fafaf2" }}
        />

        <select
          value={filters.subjectId}
          onChange={(e) => handleFilterChange("subjectId", e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid #d1c9b4", background: "#fafaf2" }}
        >
          <option value="">Tất cả môn học</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>

        <select
          value={filters.grade}
          onChange={(e) => handleFilterChange("grade", e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid #d1c9b4", background: "#fafaf2" }}
        >
          <option value="">Tất cả khối lớp</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
            <option key={grade} value={grade}>Lớp {grade}</option>
          ))}
        </select>

        <select
          value={filters.address}
          onChange={(e) => handleFilterChange("address", e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid #d1c9b4", background: "#fafaf2" }}
        >
          <option value="">Tìm theo tỉnh/thành</option>
          {provinces.map((province) => (
            <option key={province} value={province}>{province}</option>
          ))}
        </select>
      </div>

      {status === "loading" && (
        <div className="student-find-tutor__grid">
          <TutorCardSkeleton />
          <TutorCardSkeleton />
          <TutorCardSkeleton />
        </div>
      )}

      {status === "empty" && <EmptyState />}
      {status === "error" && <ErrorState onRetry={loadClasses} />}

      {status === "success" && (
        <div className="student-find-tutor__grid">
          {classes.map((cls) => (
            <ClassCard key={cls.id} cls={cls} onBook={() => openBookingModal(cls)} />
          ))}
        </div>
      )}

      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 20,
              maxWidth: 450,
              width: "100%",
              position: "relative",
            }}
          >
            <h2 style={{ marginBottom: 16 }}>Xác nhận đặt lịch</h2>
            {selectedClass && (
              <div style={{ marginBottom: 20, padding: 16, background: "#f9f9f0", borderRadius: 12 }}>
                <p><strong>Lớp:</strong> {selectedClass.title}</p>
                <p><strong>Gia sư:</strong> {selectedClass.tutorName}</p>
                <p><strong>Học phí:</strong> {selectedClass.pricePerSession?.toLocaleString("vi-VN")}đ/buổi</p>
                <p><strong>Số buổi/tuần:</strong> {selectedClass.totalSessions ?? "Chưa cập nhật"}</p>
                <p><strong>Tỉnh/thành:</strong> {selectedClass.tutorAddress || selectedClass.address || "Không rõ"}</p>
              </div>
            )}

            <form onSubmit={handleBookingSubmit}>


              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Ghi chú cho gia sư:</label>
                <textarea
                  placeholder="Yêu cầu riêng, trình độ hiện tại..."
                  value={bookingForm.note}
                  onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", minHeight: 80 }}
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: 12, borderRadius: 99, border: "1px solid #ddd", background: "#fff" }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 99,
                    border: "none",
                    background: "var(--color-primary, #7C6E27)",
                    color: "#fff",
                    fontWeight: 600,
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? "Đang xử lý..." : "Đăng ký lớp học"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ClassCard({ cls, onBook }) {
  return (
    <article className="tutor-card" style={{ cursor: "default" }}>
      <div className="tutor-card__top">
        <div className="lazy-avatar">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #b0a18e, #d4c5b0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {cls.subjectName?.[0] ?? "?"}
          </div>
        </div>

        <div className="tutor-card__main">
          <h3 className="tutor-card__name">{cls.title}</h3>

          <div className="tutor-card__rating">
            <span className="material-symbols-outlined tutor-card__star">star</span>
            <span className="tutor-card__rating-value">{cls.tutorRating?.toFixed(1) ?? "--"}</span>
            <span className="tutor-card__reviews">({cls.tutorTotalReviews ?? 0} đánh giá)</span>
          </div>

          <div className="tutor-card__tags">
            <span className="tutor-card__tag">{cls.subjectName}</span>
            <span className="tutor-card__tag">Lớp {cls.grade}</span>
          </div>
        </div>
      </div>

      <p className="tutor-card__desc" style={{ fontSize: 13, marginTop: 8, color: "#666" }}>
        Gia sư: <strong>{cls.tutorName}</strong> · {cls.durationMinutes} phút/buổi ·{" "}
        {cls.totalSessions ?? "?"} buổi/tuần · {cls.currentStudents}/{cls.maxStudents} học viên nhận dạy
      </p>

      <div className="tutor-card__bottom">
        <div>
          <p className="tutor-card__fee-label">HỌC PHÍ/BUỔI</p>
          <p className="tutor-card__fee">
            {cls.pricePerSession?.toLocaleString("vi-VN")}
            <span>đ</span>
          </p>
        </div>

        <button
          className="tutor-card__btn"
          disabled={cls.isFull}
          onClick={onBook}
          style={{ opacity: cls.isFull ? 0.5 : 1 }}
        >
          {cls.isFull ? "Hết chỗ" : "Đăng ký"}
        </button>
      </div>
    </article>
  );
}
