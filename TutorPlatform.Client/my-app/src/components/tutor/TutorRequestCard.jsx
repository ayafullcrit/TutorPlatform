export default function TutorRequestCard({ item, onApprove, onReject }) {
  return (
    <article className="tutor-request tutor-card">
      <div className="tutor-request__left">
        <img src={`anonymous.jpg`} alt="Anonymous" />

        <div>
          <div className="tutor-request__heading">
            <h3>{item.name}</h3>
            <span>Mới</span>
          </div>

          <p>
            {item.subject} · {item.time}
          </p>

          <blockquote>“{item.note}”</blockquote>
        </div>
      </div>

      <div className="tutor-request__actions">
        <button
          className="tutor-btn tutor-btn--primary"
          onClick={onApprove}
        >
          <span className="material-symbols-outlined">check</span>
          Chấp nhận
        </button>

        <button
          className="tutor-btn tutor-btn--ghost"
          onClick={onReject}
        >
          <span className="material-symbols-outlined">close</span>
          Từ chối
        </button>
      </div>
    </article>
  );
}