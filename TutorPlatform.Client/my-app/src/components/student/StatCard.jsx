export default function StatCard({ icon, title, value, trend }) {
  return (
    <div className="student-stat-card">
      <div className="student-stat-card__top">
        <div className="student-stat-card__icon-wrap">
          <span className="material-symbols-outlined student-stat-card__icon">
            {icon}
          </span>
        </div>
        <span className="student-stat-card__trend">{trend}</span>
      </div>

      <div className="student-stat-card__body">
        <p className="student-stat-card__title">{title}</p>
        <h3 className="student-stat-card__value">{value}</h3>
      </div>
    </div>
  );
}