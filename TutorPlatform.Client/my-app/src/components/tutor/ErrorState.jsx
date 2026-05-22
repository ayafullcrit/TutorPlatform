export default function ErrorState({ onRetry }) {
  return (
    <div className="tutor-state tutor-card">
      <span className="material-symbols-outlined tutor-state__icon">wifi_off</span>
      <h3 className="tutor-state__title">Lỗi mạng</h3>
      <p className="tutor-state__text">Không thể tải dữ liệu. Vui lòng thử lại.</p>
      <button className="tutor-btn tutor-btn--primary" onClick={onRetry}>
        Thử lại
      </button>
    </div>
  );
}