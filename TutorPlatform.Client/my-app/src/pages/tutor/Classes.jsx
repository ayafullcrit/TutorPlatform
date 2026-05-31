import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Classes() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isVerified = Boolean(user?.isTutorVerified);

  const statusText = useMemo(() => (
    isVerified ? "Tài khoản của bạn đã được duyệt" : "Bạn phải chờ admin duyệt trước khi sử dụng chức năng này"
  ), [isVerified]);

  if (!isVerified) {
    return (
      <div className="tutor-page__pending">
        <div className="tutor-page__pending-card">
          <span className="material-symbols-outlined tutor-page__pending-icon">pending_actions</span>
          <h1>Chức năng đang chờ duyệt</h1>
          <p>{statusText}</p>

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
    <div style={{ padding: 24 }}>
      <h1>Quản lý lớp học</h1>
      <p>Trang này chỉ hiển thị sau khi admin đã duyệt tài khoản gia sư.</p>
    </div>
  );
}
