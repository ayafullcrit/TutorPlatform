import React, { useState, useEffect } from 'react';
import { reviewApi } from '../api/reviewApi';
import './ReviewSection.css';

/**
 * ReviewSection
 * Props:
 *   - tutorId: int
 *   - tutorName: string
 */
function ReviewSection({ tutorId, tutorName }) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tutorId) loadReviews();
    }, [tutorId]);

    const loadReviews = async () => {
        try {
            const res = await reviewApi.getTutorReviews(tutorId);
            if (res.success) setSummary(res.data);
        } catch {
            // không có review cũng không sao
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="reviews-loading">Đang tải đánh giá...</div>;

    return (
        <div className="review-section">
            <h3 className="review-section-title">⭐ Đánh giá gia sư</h3>

            {/* Rating Summary */}
            {summary && summary.totalReviews > 0 ? (
                <>
                    <RatingSummary summary={summary} />
                    <div className="reviews-list">
                        {summary.reviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="no-reviews">
                    <span className="no-reviews-icon">💬</span>
                    <p>Chưa có đánh giá nào cho gia sư này.</p>
                    <p className="no-reviews-hint">Hãy là người đầu tiên đánh giá sau khi hoàn thành buổi học!</p>
                </div>
            )}
        </div>
    );
}

function RatingSummary({ summary }) {
    return (
        <div className="rating-summary">
            {/* Big score */}
            <div className="rating-score-block">
                <span className="rating-big">{summary.averageRating.toFixed(1)}</span>
                <StarDisplay rating={summary.averageRating} size="lg" />
                <span className="rating-count">{summary.totalReviews} đánh giá</span>
            </div>

            {/* Breakdown bars */}
            <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map(star => {
                    const count = summary.ratingBreakdown[star] || 0;
                    const pct = summary.totalReviews > 0
                        ? Math.round((count / summary.totalReviews) * 100)
                        : 0;
                    return (
                        <div key={star} className="breakdown-row">
                            <span className="breakdown-label">{star} ★</span>
                            <div className="breakdown-bar-track">
                                <div
                                    className="breakdown-bar-fill"
                                    style={{ width: `${pct}%`, '--star': star }}
                                />
                            </div>
                            <span className="breakdown-count">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ReviewCard({ review }) {
    const initials = review.studentName
        ? review.studentName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
        : '?';

    return (
        <div className="review-card">
            <div className="review-card-header">
                <div className="reviewer-avatar">
                    {review.studentAvatar
                        ? <img src={review.studentAvatar} alt={review.studentName} />
                        : <span>{initials}</span>
                    }
                </div>
                <div className="reviewer-info">
                    <span className="reviewer-name">{review.studentName}</span>
                    <span className="review-time">{review.timeAgo}</span>
                </div>
                <div className="review-stars-right">
                    <StarDisplay rating={review.rating} size="sm" />
                    {review.isVerified && (
                        <span className="verified-badge">✓ Đã xác thực</span>
                    )}
                </div>
            </div>
            {review.comment && (
                <p className="review-comment">"{review.comment}"</p>
            )}
        </div>
    );
}

function StarDisplay({ rating, size = 'sm' }) {
    return (
        <div className={`star-display star-${size}`}>
            {[1, 2, 3, 4, 5].map(i => (
                <span
                    key={i}
                    className={i <= Math.round(rating) ? 'star-filled' : 'star-empty'}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

export { StarDisplay };
export default ReviewSection;