import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import './BookingModal.css';

/**
 * BookingModal - Popup đặt lịch học
 * Props:
 *   - classData: object { id, title, pricePerSession, durationMinutes, tutorName }
 *   - onClose: function
 *   - onSuccess: function
 */
function BookingModal({ classData, onClose, onSuccess }) {
    const navigate = useNavigate();
    const [startTime, setStartTime] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = !!localStorage.getItem('token');

    // Min datetime: now + 1 hour
    const minDateTime = new Date(Date.now() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16);

    // Validate thời gian được chọn
    const validateBookingTime = () => {
        if (!startTime) {
            setError('Vui lòng chọn thời gian bắt đầu.');
            return false;
        }

        const selectedTime = new Date(startTime);
        const now = new Date();
        const minAllowedTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 giờ từ bây giờ

        // Kiểm tra thời gian được chọn có lớn hơn thời gian hiện tại + 1 giờ không
        if (selectedTime <= now) {
            setError('❌ Thời gian bắt đầu phải ở trong tương lai.');
            return false;
        }

        if (selectedTime < minAllowedTime) {
            setError('❌ Vui lòng chọn thời gian ít nhất 1 giờ từ bây giờ.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (user.role === 2) {
            setError('Gia sư không thể đặt lịch học.');
            return;
        }

        // Validate thời gian booking
        if (!validateBookingTime()) {
            return;
        }

        setLoading(true);
        try {
            const response = await bookingApi.createBooking({
                classId: classData.id,
                startTime: new Date(startTime).toISOString(),
                note,
            });

            if (response.success) {
                onSuccess?.(response.data);
            } else {
                setError(response.message || 'Đặt lịch thất bại');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="booking-modal-header">
                    <h2>📚 Đặt lịch học</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                {/* Class Summary */}
                <div className="class-summary">
                    <h3>{classData.title}</h3>
                    <div className="summary-row">
                        <span>👨‍🏫 Gia sư:</span>
                        <strong>{classData.tutorName}</strong>
                    </div>
                    <div className="summary-row">
                        <span>⏱️ Thời lượng:</span>
                        <strong>{classData.durationMinutes} phút</strong>
                    </div>
                    <div className="summary-row price-row">
                        <span>💰 Học phí:</span>
                        <strong className="price">{formatCurrency(classData.pricePerSession)}</strong>
                    </div>
                </div>

                {/* Not logged in */}
                {!isLoggedIn ? (
                    <div className="login-prompt">
                        <p>Bạn cần đăng nhập để đặt lịch học.</p>
                        <button className="btn-login" onClick={() => navigate('/login')}>
                            Đăng nhập ngay
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <div className="form-error">{error}</div>}

                        {/* Balance warning */}
                        {user.balance < classData.pricePerSession && (
                            <div className="balance-warning">
                                ⚠️ Số dư hiện tại ({formatCurrency(user.balance || 0)}) không đủ để đặt lịch.
                            </div>
                        )}

                        {/* Start Time */}
                        <div className="form-group">
                            <label>📅 Chọn thời gian bắt đầu <span className="required">*</span></label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => {
                                    setStartTime(e.target.value);
                                    // Xóa error khi user chọn lại thời gian hợp lệ
                                    if (e.target.value && error.includes('Thời gian')) {
                                        setError('');
                                    }
                                }}
                                min={minDateTime}
                                required
                            />
                            <p className="form-hint">
                                ⏰ Thời gian phải ít nhất <strong>1 giờ từ bây giờ</strong>. 
                                Thời gian kết thúc sẽ tự động tính sau {classData.durationMinutes} phút.
                            </p>
                        </div>

                        {/* Note */}
                        <div className="form-group">
                            <label>📝 Ghi chú (tùy chọn)</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Yêu cầu đặc biệt, câu hỏi cho gia sư..."
                                maxLength={500}
                                rows={3}
                            />
                            <span className="char-count">{note.length}/500</span>
                        </div>

                        {/* Actions */}
                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn-book"
                                disabled={loading || user.balance < classData.pricePerSession}
                            >
                                {loading ? 'Đang đặt...' : `💳 Xác nhận đặt (${formatCurrency(classData.pricePerSession)})`}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default BookingModal;