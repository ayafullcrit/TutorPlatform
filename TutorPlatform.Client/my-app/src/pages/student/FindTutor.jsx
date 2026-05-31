import { useEffect, useMemo, useState } from "react";
import ErrorState from "../../components/student/ErrorState";
import TutorCardSkeleton from "../../components/student/TutorCardSkeleton";
import { getAllSubjects } from "../../services/subjectService";
import { searchTutors } from "../../services/tutorService";

const provinces = [
  "An Giang","Bà Rịa - Vũng Tàu","Bắc Giang","Bắc Kạn","Bạc Liêu","Bắc Ninh","Bến Tre",
  "Bình Dương","Bình Định","Bình Phước","Bình Thuận","Cà Mau","Cần Thơ","Cao Bằng",
  "Đà Nẵng","Đắk Lắk","Đắk Nông","Điện Biên","Đồng Nai","Đồng Tháp","Gia Lai",
  "Hà Giang","Hà Nam","Hà Nội","Hà Tĩnh","Hải Dương","Hải Phòng","Hậu Giang",
  "Hòa Bình","Hưng Yên","Khánh Hòa","Kiên Giang","Kon Tum","Lai Châu","Lâm Đồng",
  "Lạng Sơn","Lào Cai","Long An","Nam Định","Nghệ An","Ninh Bình","Ninh Thuận",
  "Phú Thọ","Phú Yên","Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Ninh","Quảng Trị",
  "Sóc Trăng","Sơn La","Tây Ninh","Thái Bình","Thái Nguyên","Thanh Hóa","Thừa Thiên Huế",
  "Tiền Giang","TP. Hồ Chí Minh","Trà Vinh","Tuyên Quang","Vĩnh Long","Vĩnh Phúc","Yên Bái"
];

export default function FindTutor() {
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filters, setFilters] = useState({
    keyword: "",
    address: "",
    subjectId: "",
    page: 1,
    pageSize: 20,
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    loadTutors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadSubjects = async () => {
    try {
      const result = await getAllSubjects();
      if (result?.success && result.data) setSubjects(result.data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
  };

  const loadTutors = async () => {
    setStatus("loading");
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "" && value !== null && value !== undefined)
      );
      const result = await searchTutors(params);
      const items = result?.success ? result.data?.items ?? [] : [];
      setTutors(Array.isArray(items) ? items : []);
      setStatus(items.length === 0 ? "empty" : "success");
    } catch (error) {
      console.error("Failed to load tutors:", error);
      setStatus("error");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const subjectOptions = useMemo(() => subjects, [subjects]);

  return (
    <div className="student-find-tutor">
      <div className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Tìm gia sư theo nhu cầu</h1>
          <p className="student-dashboard__subtext">
            Lọc theo tỉnh/thành, môn học và từ khóa để tìm đúng gia sư phù hợp.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Tìm theo tên gia sư hoặc tỉnh thành..."
          value={filters.keyword}
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
          style={{ flex: "1 1 240px", padding: "8px 14px", borderRadius: 999, border: "1px solid #d1c9b4", background: "#fafaf2" }}
        />

        <select
          value={filters.address}
          onChange={(e) => handleFilterChange("address", e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid #d1c9b4", background: "#fafaf2", minWidth: 220 }}
        >
          <option value="">Tất cả tỉnh/thành</option>
          {provinces.map((province) => (
            <option key={province} value={province}>{province}</option>
          ))}
        </select>

        <select
          value={filters.subjectId}
          onChange={(e) => handleFilterChange("subjectId", e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid #d1c9b4", background: "#fafaf2" }}
        >
          <option value="">Tất cả môn học</option>
          {subjectOptions.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
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

      {status === "empty" && (
        <div className="student-state">
          <span className="material-symbols-outlined student-state__icon">search_off</span>
          <h3 className="student-state__title">Không tìm thấy gia sư phù hợp</h3>
          <p className="student-state__text">Hãy thử đổi tỉnh/thành hoặc từ khóa tìm kiếm.</p>
        </div>
      )}

      {status === "error" && <ErrorState onRetry={loadTutors} />}

      {status === "success" && (
        <div className="student-find-tutor__grid">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.tutorUserId} tutor={tutor} />
          ))}
        </div>
      )}
    </div>
  );
}

function TutorCard({ tutor }) {
  return (
    <article className="tutor-card">
      <div className="tutor-card__top">
        <div className="lazy-avatar">
          <div style={{
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
          }}>
            {(tutor.tutorName?.[0] || "?").toUpperCase()}
          </div>
        </div>

        <div className="tutor-card__main">
          <h3 className="tutor-card__name">{tutor.tutorName}</h3>
          <div className="tutor-card__rating">
            <span className="material-symbols-outlined tutor-card__star">star</span>
            <span className="tutor-card__rating-value">{Number(tutor.rating ?? 0).toFixed(1)}</span>
            <span className="tutor-card__reviews">({tutor.totalReviews ?? 0} đánh giá)</span>
          </div>
          <div className="tutor-card__tags">
            <span className="tutor-card__tag">{tutor.address || "Chưa cập nhật tỉnh/thành"}</span>
            {(tutor.subjects || []).slice(0, 2).map((subject) => (
              <span key={subject} className="tutor-card__tag">{subject}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="tutor-card__desc" style={{ fontSize: 13, marginTop: 8, color: "#666" }}>
        Email: <strong>{tutor.email}</strong>
      </p>

      <div className="tutor-card__bottom">
        <div>
          <p className="tutor-card__fee-label">HỌC PHÍ/GIỜ</p>
          <p className="tutor-card__fee">
            {Number(tutor.hourlyRate ?? 0).toLocaleString("vi-VN")}
            <span>đ</span>
          </p>
        </div>

        <button className="tutor-card__btn" type="button">
          Xem hồ sơ
        </button>
      </div>
    </article>
  );
}
