export default function ErrorState({ onRetry }) {
  return (
    <div className="student-state">
      <span className="material-symbols-outlined student-state__icon">
        wifi_off
      </span>
      <h3 className="student-state__title">Đã xảy ra lỗi mạng</h3>
      <p className="student-state__text">
        Không thể tải dữ liệu. Vui lòng thử lại.
      </p>
      <button className="student-state__btn" onClick={onRetry}>
        Thử lại
      </button>
    </div>
  );
}