import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { reviewApi } from '../api/reviewApi';
import './MyBookingsPage.css';
import WriteReviewModal from './WriteReviewModal';

const STATUS_TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'Pending', label: '⏳ Chờ xác nhận' },
    { key: 'Confirmed', label: '✅ Đã xác nhận' },
    { key: 'Completed', label: '🎓 Hoàn thành' },
    { key: 'Cancelled', label: '❌ Đã hủy' },
];

function MyBookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null });
    const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
    const [reviewedIds, setReviewedIds] = useState(new Set());

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isTutor = user.role === 2;

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const response = isTutor
                ? await bookingApi.getMyBookingsAsTutor()
                : await bookingApi.getMyBookingsAsStudent();

            if (response.success) {
                setBookings(response.data);
                // For student only: check which completed bookings have been reviewed
                if (!isTutor) {
                    await loadReviewedStatuses(response.data);
                }
            }
        } catch (error) {
            showMessage('Không thể tải danh sách booking', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadReviewedStatuses = async (bookingsList) => {
        const completedBookings = bookingsList.filter(b => b.status === 3);
        if (completedBookings.length === 0) return;

        // Check each completed booking to see if the student has already reviewed the tutor
        const results = await Promise.allSettled(
            completedBookings.map(booking =>
                reviewApi.getMyReviewForTutor(booking.tutorUserId)
                    .then(response => response.success ? booking.id : null)
                    .catch(() => null)
            )
        );
        const reviewed = new Set(results.map(r => r.value).filter(Boolean));
        setReviewedIds(reviewed);
    };

    const handleCancel = async () => {
        try {
            const fn = isTutor
                ? bookingApi.cancelBookingByTutor
                : bookingApi.cancelBookingByStudent;

            const response = await fn(cancelModal.bookingId);
            if (response.success) {
                showMessage('Hủy booking thành công. Tiền đã được hoàn lại.', 'success');
                loadBookings();
            } else {
                showMessage(response.message, 'error');
            }
        } catch (error) {
            showMessage('Lỗi khi hủy booking', 'error');
        }
        setCancelModal({ open: false, bookingId: null });
    };

    const handleConfirm = async (bookingId) => {
        try {
            const response = await bookingApi.confirmBooking(bookingId);
            if (response.success) {
                showMessage('✅ Đã xác nhận booking!', 'success');
                loadBookings();
            } else {
                showMessage(response.message, 'error');
            }
        } catch {
            showMessage('Lỗi khi xác nhận', 'error');
        }
    };

    const handleComplete = async (bookingId) => {
        try {
            const response = await bookingApi.completeBooking(bookingId);
            if (response.success) {
                showMessage('🎓 Đã đánh dấu hoàn thành! Tiền đã vào tài khoản.', 'success');
                loadBookings();
            } else {
                showMessage(response.message, 'error');
            }
        } catch {
            showMessage('Lỗi khi cập nhật', 'error');
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    };

    const filteredBookings = activeTab === 'all'
        ? bookings
        : bookings.filter(b => b.status === getStatusNumber(activeTab));

    function getStatusNumber(key) {
        const map = { Pending: 1, Confirmed: 2, Completed: 3, Cancelled: 4 };
        return map[key];
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';

    return (
        <div className="bookings-container">
            {/* Header */}
            <div className="bookings-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate('/dashboard')}>← Quay lại</button>
                    <h1>{isTutor ? '📋 Quản lý đặt lịch' : '📚 Lịch học của tôi'}</h1>
                </div>
                {!isTutor && (
                    <button className="btn-find-class" onClick={() => navigate('/classes')}>
                        🔍 Tìm lớp học
                    </button>
                )}
            </div>

            {/* Message */}
            {message.text && (
                <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}

            {/* Stats */}
            <div className="bookings-stats">
                <div className="stat-card">
                    <span className="stat-number">{bookings.length}</span>
                    <span className="stat-label">Tổng booking</span>
                </div>
                <div className="stat-card pending">
                    <span className="stat-number">{bookings.filter(b => b.status === 1).length}</span>
                    <span className="stat-label">Chờ xác nhận</span>
                </div>
                <div className="stat-card confirmed">
                    <span className="stat-number">{bookings.filter(b => b.status === 2).length}</span>
                    <span className="stat-label">Đã xác nhận</span>
                </div>
                <div className="stat-card completed">
                    <span className="stat-number">{bookings.filter(b => b.status === 3).length}</span>
                    <span className="stat-label">Hoàn thành</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                        {tab.key !== 'all' && (
                            <span className="tab-count">
                                {bookings.filter(b => b.status === getStatusNumber(tab.key)).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Đang tải...</div>
            ) : filteredBookings.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>Chưa có booking nào</h3>
                    {!isTutor && (
                        <button className="btn-primary" onClick={() => navigate('/classes')}>
                            Tìm lớp học ngay
                        </button>
                    )}
                </div>
            ) : (
                <div className="bookings-list">
                    {filteredBookings.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            isTutor={isTutor}
                            reviewedIds={reviewedIds}
                            onConfirm={handleConfirm}
                            onComplete={handleComplete}
                            onCancel={(id) => setCancelModal({ open: true, bookingId: id })}
                            onOpenReviewModal={(booking) => setReviewModal({ open: true, booking })}
                            formatDate={formatDate}
                            formatCurrency={formatCurrency}
                        />
                    ))}
                </div>
            )}

            {/* Cancel Modal */}
            {cancelModal.open && (
                <div className="modal-overlay" onClick={() => setCancelModal({ open: false, bookingId: null })}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>⚠️ Xác nhận hủy booking</h3>
                        <p>
                            {isTutor
                                ? 'Khi hủy, học sinh sẽ được hoàn tiền 100%. Bạn có chắc muốn hủy?'
                                : 'Booking Pending sẽ hoàn 100%. Booking Confirmed sẽ hoàn 80%. Bạn có chắc muốn hủy?'
                            }
                        </p>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setCancelModal({ open: false, bookingId: null })}>
                                Không hủy
                            </button>
                            <button className="btn-danger" onClick={handleCancel}>
                                Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {reviewModal.open && (
                <WriteReviewModal
                    booking={reviewModal.booking}
                    onClose={() => setReviewModal({ open: false, booking: null })}
                    onSuccess={() => {
                        // After successful review, mark this booking as reviewed
                        if (reviewModal.booking) {
                            setReviewedIds(prev => new Set([...prev, reviewModal.booking.id]));
                        }
                        setReviewModal({ open: false, booking: null });
                        showMessage('⭐ Cảm ơn bạn đã đánh giá!', 'success');
                        // Reload bookings to update any UI changes
                        loadBookings();
                    }}
                />
            )}
        </div>
    );
}

function BookingCard({ booking, isTutor, reviewedIds, onConfirm, onComplete, onCancel, onOpenReviewModal, formatDate, formatCurrency }) {
    const statusClass = {
        1: 'status-pending',
        2: 'status-confirmed',
        3: 'status-completed',
        4: 'status-cancelled',
        5: 'status-noshow',
    }[booking.status] || '';

    return (
        <div className={`booking-card ${statusClass}`}>
            <div className="booking-card-header">
                <div className="booking-class-info">
                    <h3 className="booking-class-title">{booking.classTitle}</h3>
                    <span className="booking-subject">{booking.subjectName}</span>
                </div>
                <span className={`status-badge ${statusClass}`}>{booking.statusText}</span>
            </div>

            <div className="booking-card-body">
                <div className="booking-details">
                    <div className="detail-row">
                        <span className="detail-label">
                            {isTutor ? '👤 Học sinh:' : '👨‍🏫 Gia sư:'}
                        </span>
                        <span className="detail-value">
                            {isTutor ? booking.studentName : booking.tutorName}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">📅 Ngày đặt:</span>
                        <span className="detail-value">{formatDate(booking.bookingDate)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">⏰ Bắt đầu:</span>
                        <span className="detail-value">{formatDate(booking.startTime)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">⌛ Kết thúc:</span>
                        <span className="detail-value">{formatDate(booking.endTime)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">💰 Học phí:</span>
                        <span className="detail-value price">{formatCurrency(booking.pricePerSession)}</span>
                    </div>
                    {booking.note && (
                        <div className="detail-row">
                            <span className="detail-label">📝 Ghi chú:</span>
                            <span className="detail-value">{booking.note}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="booking-card-actions">
                {/* Tutor actions */}
                {isTutor && booking.status === 1 && (
                    <>
                        <button className="btn-confirm" onClick={() => onConfirm(booking.id)}>
                            ✅ Xác nhận
                        </button>
                        <button className="btn-cancel-booking" onClick={() => onCancel(booking.id)}>
                            ❌ Từ chối
                        </button>
                    </>
                )}
                {isTutor && booking.status === 2 && (
                    <>
                        <button className="btn-complete" onClick={() => onComplete(booking.id)}>
                            🎓 Hoàn thành
                        </button>
                        <button className="btn-cancel-booking" onClick={() => onCancel(booking.id)}>
                            ❌ Hủy
                        </button>
                    </>
                )}

                {/* Student actions */}
                {!isTutor && (booking.status === 1 || booking.status === 2) && (
                    <button className="btn-cancel-booking" onClick={() => onCancel(booking.id)}>
                        ❌ Hủy booking
                    </button>
                )}

                {/* Student review button for completed bookings */}
                {!isTutor && booking.status === 3 && (
                    reviewedIds.has(booking.id)
                        ? <span className="reviewed-badge">✓ Đã đánh giá</span>
                        : <button
                            className="btn-review"
                            onClick={() => onOpenReviewModal(booking)}
                          >
                            ⭐ Viết đánh giá
                          </button>
                )}
            </div>
        </div>
    );
}

export default MyBookingsPage;