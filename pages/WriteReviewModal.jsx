import React, { useState } from 'react';
import { reviewApi } from '../api/reviewApi';
import './WriteReviewModal.css';

/**
 * WriteReviewModal
 * Props:
 *   - booking: { id, tutorId, tutorName, classTitle }
 *   - onClose: fn
 *   - onSuccess: fn(reviewData)
 */
function WriteReviewModal({ booking, onClose, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Vui lòng chọn số sao đánh giá.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await reviewApi.createReview({
                tutorId: booking.tutorId,
                bookingId: booking.id,
                rating,
                comment,
            });

            if (res.success) {
                onSuccess?.(res.data);
            } else {
                setError(res.message || 'Gửi đánh giá thất bại');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi');
        } finally {
            setLoading(false);
        }
    };

    const ratingLabels = {
        1: 'Rất tệ 😞',
        2: 'Không hài lòng 😕',
        3: 'Bình thường 😐',
        4: 'Hài lòng 😊',
        5: 'Tuyệt vời! 🤩',
    };

    const activeRating = hovered || rating;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="review-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="review-modal-header">
                    <h2>✍️ Viết đánh giá</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                {/* Context */}
                <div className="review-context">
                    <p>Đánh giá buổi học với <strong>{booking.tutorName}</strong></p>
                    <span className="review-class-name">{booking.classTitle}</span>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="form-error">{error}</div>}

                    {/* Star picker */}
                    <div className="star-picker-group">
                        <label>Mức độ hài lòng</label>
                        <div className="star-picker">
                            {[1, 2, 3, 4, 5].map(i => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`star-btn ${i <= activeRating ? 'active' : ''}`}
                                    onMouseEnter={() => setHovered(i)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => setRating(i)}
                                    aria-label={`${i} sao`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <span className="rating-label-text">
                            {activeRating > 0 ? ratingLabels[activeRating] : 'Chọn số sao...'}
                        </span>
                    </div>

                    {/* Comment */}
                    <div className="form-group">
                        <label>Nhận xét (tùy chọn)</label>
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder={`Chia sẻ trải nghiệm học với ${booking.tutorName}...`}
                            maxLength={1000}
                            rows={4}
                        />
                        <span className="char-count">{comment.length}/1000</span>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Để sau
                        </button>
                        <button
                            type="submit"
                            className="btn-submit-review"
                            disabled={loading || rating === 0}
                        >
                            {loading ? 'Đang gửi...' : '⭐ Gửi đánh giá'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WriteReviewModal;