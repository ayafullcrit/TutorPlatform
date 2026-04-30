export default function TutorStatCard({ icon, label, value, trend }) {
  return (
    <div className="tutor-stat tutor-card">
      <div className="tutor-stat__top">
        <div className="tutor-stat__icon">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className="tutor-stat__trend">{trend}</span>
      </div>

      <p className="tutor-stat__label">{label}</p>
      <h3 className="tutor-stat__value">{value}</h3>
    </div>
  );
}