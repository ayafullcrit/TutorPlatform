export default function EmptyState() {
  return (
    <div className="student-state">
      <span className="material-symbols-outlined student-state__icon">
        search_off
      </span>
      <h3 className="student-state__title">Không tìm thấy gia sư phù hợp</h3>
      <p className="student-state__text">
        Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
      </p>
    </div>
  );
}