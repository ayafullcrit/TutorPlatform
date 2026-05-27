import { useMemo, useState, useEffect } from "react";
import TutorReviewCard from "../../components/tutor/TutorReviewCard";
import { getTutorReviews } from "../../services/reviewService";
import { getCurrentUser } from "../../services/authService";

const ratingFilters = [
  { value: "all", label: "Tất cả đánh giá" },
  { value: "5", label: "5 sao" },
  { value: "4", label: "4 sao" },
  { value: "3", label: "3 sao" },
  { value: "2", label: "2 sao" },
  { value: "1", label: "1 sao" },
];

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          const response = await getTutorReviews(user.id);
          if (response.success && response.data) {
            setReviews(response.data.reviews || []);
            setSummary({
              averageRating: response.data.averageRating || 0,
              totalReviews: response.data.totalReviews || 0,
              ratingBreakdown: response.data.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const { averageRating, totalReviews, ratingBreakdown } = summary;

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const keyword = searchTerm.toLowerCase();

      const studentMatch = review.studentName?.toLowerCase().includes(keyword) || false;
      const commentMatch = review.comment?.toLowerCase().includes(keyword) || false;
      
      const matchSearch = studentMatch || commentMatch;

      const matchRating =
        ratingFilter === "all" || review.rating === Number(ratingFilter);

      return matchSearch && matchRating;
    });
  }, [reviews, searchTerm, ratingFilter]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={
          index < Math.round(rating)
            ? "tutor-reviews__star tutor-reviews__star--filled"
            : "tutor-reviews__star"
        }
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="tutor-reviews">
        <div className="tutor-page__header">
          <h1 className="tutor-page__title">Đang tải dữ liệu...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="tutor-reviews">
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Đánh giá của học viên</h1>
          <p className="tutor-page__subtitle">
            Theo dõi phản hồi, điểm đánh giá trung bình và chất lượng giảng dạy.
          </p>
        </div>
      </div>

      <section className="tutor-reviews__summary">
        <div className="tutor-card tutor-reviews__average-card">
          <p>Điểm trung bình</p>

          <div className="tutor-reviews__average-score">
            <h2>{averageRating.toFixed(1)}</h2>
            <div>
              <div className="tutor-reviews__stars">
                {renderStars(Number(averageRating))}
              </div>
              <span>{totalReviews} đánh giá</span>
            </div>
          </div>
        </div>

        <div className="tutor-card tutor-reviews__small-card">
          <span className="material-symbols-outlined">reviews</span>
          <p>Tổng số đánh giá</p>
          <h3>{totalReviews}</h3>
        </div>

        <div className="tutor-card tutor-reviews__small-card">
          <span className="material-symbols-outlined">star</span>
          <p>Đánh giá 5 sao</p>
          <h3>{ratingBreakdown[5] || 0}</h3>
        </div>

        <div className="tutor-card tutor-reviews__small-card">
          <span className="material-symbols-outlined">trending_up</span>
          <p>Tỷ lệ hài lòng</p>
          <h3>
            {totalReviews > 0
              ? Math.round(
                  (((ratingBreakdown[5] || 0) + (ratingBreakdown[4] || 0)) /
                    totalReviews) *
                    100
                )
              : 0}
            %
          </h3>
        </div>
      </section>

      <section className="tutor-card tutor-reviews__distribution">
        <div className="tutor-reviews__section-header">
          <div>
            <h3>Phân bố đánh giá</h3>
            <p>Tỷ lệ số lượng đánh giá theo từng mức sao.</p>
          </div>
        </div>

        <div className="tutor-reviews__distribution-list">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingBreakdown[star] || 0;
            const percentage =
              totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div className="tutor-reviews__distribution-row" key={star}>
                <span>{star} sao</span>

                <div className="tutor-reviews__bar">
                  <div style={{ width: `${percentage}%` }}></div>
                </div>

                <strong>
                  {count} đánh giá · {percentage}%
                </strong>
              </div>
            );
          })}
        </div>
      </section>

      <section className="tutor-card tutor-reviews__panel">
        <div className="tutor-reviews__toolbar">
          <div className="tutor-reviews__search">
            <span className="material-symbols-outlined">search</span>
            <input
              placeholder="Tìm theo tên học viên hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="tutor-reviews__filter"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            {ratingFilters.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="tutor-reviews__list">
          {filteredReviews.length === 0 ? (
            <div className="tutor-reviews__empty">
              <span className="material-symbols-outlined">search_off</span>
              <h3>Không tìm thấy đánh giá phù hợp</h3>
              <p>Hãy thử đổi từ khóa tìm kiếm hoặc bộ lọc số sao.</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <TutorReviewCard key={review.id} review={review} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
