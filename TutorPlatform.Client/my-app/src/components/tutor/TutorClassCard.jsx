export default function TutorClassCard({ item, onViewDetail }) {
  const isActive = item.status === "active";

  return (
    <article className="tutor-class-card tutor-card">
      <div className="tutor-class-card__top">
        <span
          className={`tutor-badge ${
            isActive ? "tutor-badge--active" : "tutor-badge--pending"
          }`}
        >
          {isActive ? "Đang học" : "Chờ mở lớp"}
        </span>

        <button className="tutor-class-card__menu">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      <p className="tutor-class-card__subject">{item.subject}</p>
      <h3 className="tutor-class-card__title">{item.title}</h3>

      <div className="tutor-class-card__meta">
        <span className="material-symbols-outlined">schedule</span>
        {item.time}
      </div>

      <div className="tutor-class-card__meta">
        <span className="material-symbols-outlined">groups</span>
        {item.students}
      </div>

      <div className="tutor-class-card__footer">
        <div className="tutor-class-card__avatars">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <button
          className="tutor-btn tutor-btn--ghost"
          onClick={onViewDetail}
        >
          Xem chi tiết
        </button>
      </div>
    </article>
  );
}