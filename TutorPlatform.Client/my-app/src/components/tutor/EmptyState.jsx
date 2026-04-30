export default function EmptyState({ title = "Không có dữ liệu", text = "Hiện chưa có thông tin để hiển thị." }) {
  return (
    <div className="tutor-state tutor-card">
      <span className="material-symbols-outlined tutor-state__icon">inbox</span>
      <h3 className="tutor-state__title">{title}</h3>
      <p className="tutor-state__text">{text}</p>
    </div>
  );
}