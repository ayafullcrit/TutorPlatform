import { useEffect, useMemo, useState } from "react";
import { getStudentBookings } from "../../services/bookingService";
import { createReview, getTutorReviews } from "../../services/reviewService";

const initialForm = {
  bookingId: "",
  rating: "5",
  comment: "",
};

// BookingStatus: Pending=1, Confirmed=2, Completed=3, Cancelled=4, NoShow=5
const COMPLETED = 3;

const StarDisplay = ({ rating }) => (
  <span className="student-reviews__stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className="material-symbols-outlined"
        style={{
          fontSize: "18px",
          color: s <= rating ? "#f59e0b" : "var(--color-border)",
          fontVariationSettings: s <= rating ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        star
      </span>
    ))}
  </span>
);

export default function Reviews() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewedBookingIds, setReviewedBookingIds] = useState(new Set());
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load completed bookings + reviews for each tutor
  const loadData = async () => {
    try {
      setLoading(true);
      const bookingsResult = await getStudentBookings();
      if (bookingsResult?.success && bookingsResult.data) {
        const completedBookings = bookingsResult.data.filter(
          (b) => b.status === COMPLETED
        );
        setBookings(completedBookings);

        // Collect unique tutorIds to load reviews
        const tutorIds = [...new Set(completedBookings.map((b) => b.tutorUserId))];

        // Fetch reviews for all tutors (parallel)
        const reviewsArrays = await Promise.all(
          tutorIds.map((tid) =>
            getTutorReviews(tid).then((r) => (r?.success ? r.data?.reviews ?? [] : []))
          )
        );

        // Flatten and get current student's reviews
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const myReviews = reviewsArrays.flat().filter(
          (rv) => rv.studentId === currentUser.id
        );
        setReviews(myReviews);

        // Build set of already-reviewed bookingIds from my reviews (1 review / booking)
        const reviewed = new Set(
          myReviews
            .map((rv) => rv.bookingId)
            .filter((id) => id !== null && id !== undefined)
            .map((id) => Number(id))
        );
        setReviewedBookingIds(reviewed);
      }
    } catch (err) {
      console.error("Failed to load reviews data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const reviewableBookings = useMemo(
    () => bookings.filter((b) => !reviewedBookingIds.has(b.id)),
    [bookings, reviewedBookingIds]
  );

  const selectedBooking = useMemo(
    () => bookings.find((b) => String(b.id) === form.bookingId),
    [bookings, form.bookingId]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const result = await createReview({
        tutorId: selectedBooking.tutorUserId,
        bookingId: Number(form.bookingId),
        rating: Number(form.rating),
        comment: form.comment,
      });

      if (result?.success) {
        setSuccess("Đánh giá đã được gửi thành công!");
        setReviewedBookingIds((prev) => {
          const next = new Set(prev);
          next.add(Number(form.bookingId));
          return next;
        });
        // Add new review to list optimistically
        if (result.data) {
          setReviews((prev) => [result.data, ...prev]);
        }
        setForm(initialForm);
      } else {
        setError(result?.message || "Không thể gửi đánh giá. Vui lòng thử lại.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="student-reviews">
      {/* Hero */}
      <div className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Đánh giá buổi học</h1>
          <p className="student-dashboard__subtext">
            Chọn đúng buổi học đã hoàn thành để gửi đánh giá gia sư.
          </p>
        </div>
        <div className="student-reviews__hero-badge">
          <span className="material-symbols-outlined">reviews</span>
          <span>{reviews.length} đánh giá đã gửi</span>
        </div>
      </div>

      {/* Form */}
      <section className="student-card student-section-card">
        <div className="student-card__header">
          <h3 className="student-card__title">Viết đánh giá mới</h3>
          <span className="student-card__muted">
            {loading
              ? "Đang tải..."
              : `${reviewableBookings.length} buổi học có thể đánh giá`}
          </span>
        </div>

        {error && (
          <div className="student-reviews__alert student-reviews__alert--error">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}
        {success && (
          <div className="student-reviews__alert student-reviews__alert--success">
            <span className="material-symbols-outlined">check_circle</span>
            {success}
          </div>
        )}

        <form
          className="student-form student-form--inline"
          onSubmit={handleSubmit}
        >
          {/* Booking selector */}
          <label htmlFor="bookingId">
            Buổi học
            <select
              id="bookingId"
              name="bookingId"
              value={form.bookingId}
              onChange={handleChange}
              required
              disabled={loading || reviewableBookings.length === 0}
            >
              <option value="">
                {loading
                  ? "Đang tải..."
                  : reviewableBookings.length === 0
                  ? "Không có buổi học cần đánh giá"
                  : "Chọn buổi học"}
              </option>
              {reviewableBookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.classTitle} – {new Date(b.startTime).toLocaleString("vi-VN")} – {b.tutorName}
                </option>
              ))}
            </select>
          </label>

          {/* Preview selected booking */}
          {selectedBooking && (
            <div className="student-reviews__booking-preview">
              <span className="material-symbols-outlined">person</span>
              <span>
                <strong>{selectedBooking.tutorName}</strong> •{" "}
                {selectedBooking.subjectName || selectedBooking.classTitle}
              </span>
            </div>
          )}

          {/* Star rating */}
          <label htmlFor="rating">
            Số sao
            <select
              id="rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {"★".repeat(r)}{"☆".repeat(5 - r)} ({r} sao)
                </option>
              ))}
            </select>
          </label>

          {/* Comment */}
          <label htmlFor="comment" className="student-form__wide">
            Nhận xét
            <textarea
              id="comment"
              name="comment"
              rows="4"
              value={form.comment}
              onChange={handleChange}
              required
              placeholder="Nhận xét về chất lượng giảng dạy, thái độ của gia sư..."
              maxLength={1000}
            />
            <span className="student-reviews__char-count">
              {form.comment.length}/1000
            </span>
          </label>

          <button
            type="submit"
            className="student-dashboard__primary-btn"
            disabled={submitting || reviewableBookings.length === 0 || loading}
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined student-reviews__spin">
                  autorenew
                </span>
                Đang gửi...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Gửi đánh giá
              </>
            )}
          </button>
        </form>
      </section>

      {/* Reviews list */}
      <section>
        <div className="student-card__header" style={{ marginBottom: "16px" }}>
          <h3 className="student-card__title">Đánh giá của tôi</h3>
          <span className="student-card__muted">{reviews.length} đánh giá</span>
        </div>

        {loading ? (
          <div className="student-reviews__loading">
            <span className="material-symbols-outlined student-reviews__spin">
              autorenew
            </span>
            Đang tải đánh giá...
          </div>
        ) : reviews.length === 0 ? (
          <div className="student-reviews__empty">
            <span className="material-symbols-outlined">rate_review</span>
            <p>Bạn chưa có đánh giá nào.</p>
            <p className="student-card__muted">
              Hoàn thành buổi học để bắt đầu đánh giá gia sư.
            </p>
          </div>
        ) : (
          <div className="student-list-grid">
            {reviews.map((review) => (
              <article
                className="student-card student-management-card"
                key={review.id}
              >
                <div className="student-management-card__header">
                  <div>
                    <p className="student-card__muted" style={{ fontSize: "12px", marginBottom: "4px" }}>
                      Gia sư
                    </p>
                    <h3 className="student-card__title">{review.tutorName}</h3>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <StarDisplay rating={review.rating} />
                    <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>
                      {review.timeAgo || new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>

                {review.comment && (
                  <p
                    style={{
                      margin: "12px 0 0",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "var(--color-text)",
                    }}
                  >
                    {review.comment}
                  </p>
                )}

                {review.isVerified && (
                  <div className="student-reviews__verified">
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                      verified
                    </span>
                    Đã xác minh
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
