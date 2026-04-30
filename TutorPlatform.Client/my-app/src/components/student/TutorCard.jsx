import LazyAvatar from "./LazyAvatar";

export default function TutorCard({ tutor }) {
  return (
    <article className="tutor-card">
      <div className="tutor-card__top">
        <LazyAvatar
          src={tutor.avatar}
          alt={tutor.name}
          fallback="/assets/images/avatar-placeholder.png"
        />

        <div className="tutor-card__main">
          <h3 className="tutor-card__name">{tutor.name}</h3>

          <div className="tutor-card__rating">
            <span className="material-symbols-outlined tutor-card__star">
              star
            </span>
            <span className="tutor-card__rating-value">{tutor.rating}</span>
            <span className="tutor-card__reviews">({tutor.reviews} đánh giá)</span>
          </div>

          <div className="tutor-card__tags">
            {tutor.subjects.map((subject) => (
              <span key={subject} className="tutor-card__tag">
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="tutor-card__desc">{tutor.description}</p>

      <div className="tutor-card__bottom">
        <div>
          <p className="tutor-card__fee-label">HỌC PHÍ TỪ</p>
          <p className="tutor-card__fee">
            {tutor.price}
            <span>/giờ</span>
          </p>
        </div>

        <button className="tutor-card__btn">Chi tiết</button>
      </div>
    </article>
  );
}