import { useEffect, useState } from "react";
import ErrorState from "../../components/student/ErrorState";
import { getMyTutors, requestRemoveTutor } from "../../services/studentService";

const statusLabels = {
  active: ["Đang học", "student-badge student-badge--success"],
  removal_pending: [
    "Chờ gia sư xác nhận nghỉ",
    "student-badge student-badge--pending",
  ],
};

const formatCurrency = (amount) =>
  `${Number(amount ?? 0).toLocaleString("vi-VN")}đ`;

const mapTutor = (item) => ({
  tutorUserId: item.tutorUserId ?? item.TutorUserId ?? item.id,
  name: item.tutorName ?? item.TutorName ?? item.name ?? "",
  avatar: item.tutorAvatar ?? item.TutorAvatar ?? item.avatar ?? "",
  subject: item.subject ?? item.Subject ?? "",
  city: item.city ?? item.City ?? "",
  price: item.pricePerSession ?? item.PricePerSession ?? item.price ?? 0,
  rating: item.rating ?? item.Rating ?? 0,
  nextLesson: item.nextLesson ?? item.NextLesson ?? "--",
  status: item.status ?? item.Status ?? "active",
  leaveReason: item.leaveReason ?? item.LeaveReason ?? "",
  latestBookingId: item.latestBookingId ?? item.LatestBookingId ?? item.bookingId,
});

export default function MyTutors() {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadTutors = async () => {
    try {
      setLoadError(false);
      setLoading(true);
      const res = await getMyTutors();
      const list = res?.success ? res.data ?? [] : [];
      setTutors(Array.isArray(list) ? list.map(mapTutor) : []);
    } catch (e) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openRemoveModal = (tutor) => {
    setSelectedTutor(tutor);
    setReason("");
  };

  const closeRemoveModal = () => {
    setSelectedTutor(null);
    setReason("");
  };

  const handleRemoveSubmit = async (event) => {
    event.preventDefault();
    if (!selectedTutor?.latestBookingId) return;

    try {
      const res = await requestRemoveTutor(selectedTutor.latestBookingId, reason);
      const updated = res?.success ? res.data : null;

      if (updated) {
        const updatedTutor = mapTutor(updated);
        setTutors((current) =>
          current.map((t) =>
            t.tutorUserId === updatedTutor.tutorUserId ? updatedTutor : t
          )
        );
      } else {
        await loadTutors();
      }
      closeRemoveModal();
    } catch (e) {
      // Keep modal open so user can retry/edit reason.
      setLoadError(true);
    }
  };

  return (
    <div>
      <div className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Gia sư đang theo học</h1>
          <p className="student-dashboard__subtext">
            Theo dõi môn học, lịch gần nhất và gửi yêu cầu nghỉ học khi cần.
          </p>
        </div>
      </div>

      {loadError ? (
        <ErrorState onRetry={loadTutors} />
      ) : loading ? (
        <div className="student-state">
          <span className="material-symbols-outlined student-state__icon student-reviews__spin">
            progress_activity
          </span>
          <h3 className="student-state__title">Đang tải...</h3>
          <p className="student-state__text">Vui lòng đợi trong giây lát.</p>
        </div>
      ) : tutors.length === 0 ? (
        <div className="student-state">
          <span className="material-symbols-outlined student-state__icon">school</span>
          <h3 className="student-state__title">Bạn chưa có gia sư nào</h3>
          <p className="student-state__text">
            Hãy đặt lịch học với gia sư, danh sách sẽ hiển thị tại đây.
          </p>
        </div>
      ) : (
        <div className="student-list-grid">
          {tutors.map((tutor) => {
            const [statusText, statusClass] =
              statusLabels[tutor.status] || statusLabels.active;

            return (
              <article
                className="student-card student-management-card"
                key={tutor.tutorUserId ?? tutor.latestBookingId}
              >
                <div className="student-management-card__header">
                  <div>
                    <p className="student-card__muted">{tutor.subject}</p>
                    <h3 className="student-card__title">{tutor.name}</h3>
                  </div>
                  <span className={statusClass}>{statusText}</span>
                </div>

                <div className="student-detail-list">
                  <p>
                    <span>Tỉnh thành</span>
                    <strong>{tutor.city}</strong>
                  </p>
                  <p>
                    <span>Học phí</span>
                    <strong>{formatCurrency(tutor.price)}/gio</strong>
                  </p>
                  <p>
                    <span>Đánh giá</span>
                    <strong>{tutor.rating} / 5</strong>
                  </p>
                  <p>
                    <span>Lịch gần nhất</span>
                    <strong>{tutor.nextLesson || "--"}</strong>
                  </p>
                </div>

                {tutor.leaveReason ? (
                  <p className="student-note">Lý do đã gửi: {tutor.leaveReason}</p>
                ) : null}

                <div className="student-card-actions">
                  <button
                    className="student-secondary-btn"
                    onClick={() => openRemoveModal(tutor)}
                    disabled={tutor.status === "removal_pending"}
                  >
                    Xin nghỉ học với gia sư
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedTutor ? (
        <div className="student-modal" role="dialog" aria-modal="true">
          <div className="student-modal__content">
            <h2>Gửi yêu cầu nghỉ học</h2>
            <p className="student-card__muted">
              Yêu cầu sẽ được gửi đến gia sư {selectedTutor.name} để chờ xác nhận.
            </p>

            <form className="student-form" onSubmit={handleRemoveSubmit}>
              <label htmlFor="leave-reason">Lý do xin nghỉ</label>
              <textarea
                id="leave-reason"
                rows="4"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                required
                placeholder="Ví dụ: Em muốn dừng học vì thay đổi lịch học ở trường."
              />

              <div className="student-modal__actions">
                <button
                  type="button"
                  className="student-secondary-btn"
                  onClick={closeRemoveModal}
                >
                  Hủy
                </button>
                <button type="submit" className="student-dashboard__primary-btn">
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
