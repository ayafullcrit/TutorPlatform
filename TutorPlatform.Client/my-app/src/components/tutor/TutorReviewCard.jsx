import React from "react";

export default function TutorReviewCard({ review }) {
  const { studentName, rating, comment, timeAgo, studentAvatar, classTitle } = review;

  return (
    <div className="tutor-card tutor-review-card">
      <div className="tutor-review-card__avatar">
        {studentAvatar ? (
          <img src={studentAvatar} alt={studentName} />
        ) : (
          <span className="material-symbols-outlined">person</span>
        )}
      </div>
      
      <div className="tutor-review-card__content">
        <div className="tutor-review-card__top">
          <div>
            <h3>{studentName}</h3>
            {classTitle && <p>{classTitle}</p>}
          </div>
          <span className="tutor-review-card__date">{timeAgo}</span>
        </div>

        <div className="tutor-review-card__rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={
                index < rating
                  ? "tutor-review-card__star tutor-review-card__star--filled"
                  : "tutor-review-card__star"
              }
            >
              ★
            </span>
          ))}
          <strong>{rating.toFixed(1)}</strong>
        </div>

        {comment && <p className="tutor-review-card__comment">“{comment}”</p>}
      </div>
    </div>
  );
}
