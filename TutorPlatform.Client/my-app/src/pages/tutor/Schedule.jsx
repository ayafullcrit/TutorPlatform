import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTutorBookings,
  confirmBooking,
  completeBooking,
  cancelBookingByTutor
} from "../../services/bookingService";
import { getAvatarSrc, getInitials } from "../../utils/avatar";

export default function Schedule() {
  const navigate = useNavigate();
  
  // Date states
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  
  // Data states
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal state
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Status mapping matching BookingStatus enum (1=Pending, 2=Confirmed, 3=Completed, 4=Cancelled, 5=NoShow)
  const STATUS_LABELS = {
    1: { text: "Chờ xác nhận", class: "pending", color: "var(--tutor-pending)" },
    2: { text: "Đã xác nhận", class: "confirmed", color: "var(--tutor-success)" },
    3: { text: "Hoàn thành", class: "completed", color: "#0077b6" },
    4: { text: "Đã hủy", class: "cancelled", color: "var(--tutor-error)" },
    5: { text: "Không đến", class: "cancelled", color: "var(--tutor-muted)" }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTutorBookings();
      if (result?.success && result.data) {
        setBookings(result.data);
      } else {
        setError(result?.message || "Không thể tải danh sách lịch học");
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Đã xảy ra lỗi kết nối với máy chủ");
    } finally {
      setLoading(false);
    }
  };

  // Navigating months
  const handlePrevMonth = () => {
    setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentViewDate(new Date());
  };

  // Redirection to classes page to create a class
  const handleAddSchedule = () => {
    navigate("/tutor/classes", { state: { createClass: true } });
  };

  // Booking actions (Confirm, Complete, Cancel)
  const handleBookingAction = async (actionFn, bookingId, successMsg) => {
    const isCancel = actionFn === cancelBookingByTutor;
    if (isCancel) {
      const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy lịch học này? Hành động này không thể hoàn tác.");
      if (!confirmCancel) return;
    }

    try {
      setSubmitting(true);
      const result = await actionFn(bookingId);
      if (result?.success) {
        alert(successMsg);
        
        // Refresh details modal if open
        if (selectedBooking && selectedBooking.id === bookingId) {
          // Find and update status in response
          const updatedBooking = result.data || { ...selectedBooking, status: isCancel ? 4 : (actionFn === confirmBooking ? 2 : 3) };
          setSelectedBooking(updatedBooking);
        }
        
        // Reload all data
        await loadBookings();
      } else {
        alert(result?.message || "Hành động thất bại");
      }
    } catch (err) {
      console.error("Booking action failed:", err);
      alert(err.response?.data?.message || "Lỗi xử lý yêu cầu");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper values for current month calendar view
  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  // Filter bookings in current viewed month
  const currentMonthBookings = bookings.filter(b => {
    const bDate = new Date(b.startTime);
    return bDate.getFullYear() === year && bDate.getMonth() === month;
  });

  // Calculate statistics for currently viewed month
  const stats = {
    total: currentMonthBookings.length,
    pending: currentMonthBookings.filter(b => b.status === 1).length,
    confirmed: currentMonthBookings.filter(b => b.status === 2).length,
    completed: currentMonthBookings.filter(b => b.status === 3).length
  };

  // Date helper utilities
  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getBookingsForCell = (cellDate) => {
    return bookings.filter(b => isSameDay(new Date(b.startTime), cellDate));
  };

  // Build grid of cells for month calendar
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getDaysInPrevMonth = (y, m) => new Date(y, m, 0).getDate();
  const getFirstDayOffset = (y, m) => {
    // 0 = Sun, 1 = Mon ...
    const day = new Date(y, m, 1).getDay();
    // Map to: 0 = Mon, 1 = Tue, ..., 6 = Sun
    return day === 0 ? 6 : day - 1;
  };

  const calendarCells = [];
  const daysCount = getDaysInMonth(year, month);
  const prevDaysCount = getDaysInPrevMonth(year, month);
  const startOffset = getFirstDayOffset(year, month);

  // 1. Add previous month dates (inactive)
  for (let i = startOffset - 1; i >= 0; i--) {
    const dayNum = prevDaysCount - i;
    calendarCells.push({
      dayNum,
      date: new Date(year, month - 1, dayNum),
      isCurrentMonth: false
    });
  }

  // 2. Add current month dates
  for (let d = 1; d <= daysCount; d++) {
    calendarCells.push({
      dayNum: d,
      date: new Date(year, month, d),
      isCurrentMonth: true
    });
  }

  // 3. Pad next month dates to get complete calendar rows (multiple of 7)
  const totalCells = calendarCells.length <= 35 ? 35 : 42;
  const padCount = totalCells - calendarCells.length;
  for (let d = 1; d <= padCount; d++) {
    calendarCells.push({
      dayNum: d,
      date: new Date(year, month + 1, d),
      isCurrentMonth: false
    });
  }

  const weekdays = ["THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7", "CHỦ NHẬT"];

  // Formatting helpers
  const formatTimeSlot = (startStr, endStr) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    const timeOpts = { hour: '2-digit', minute: '2-digit', hour12: false };
    return `${s.toLocaleTimeString([], timeOpts)} - ${e.toLocaleTimeString([], timeOpts)}`;
  };

  const formatDate = (startStr) => {
    const s = new Date(startStr);
    return s.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="tutor-schedule__container">
      {/* Page Header */}
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Lịch trình giảng dạy</h1>
          <p className="tutor-page__subtitle">Theo dõi và quản lý các lịch dạy học trong tháng.</p>
        </div>

        <button className="tutor-btn tutor-btn--primary" onClick={handleAddSchedule}>
          Thêm lịch dạy
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="tutor-schedule__summary">
        <div className="tutor-schedule__summary-card">
          <div className="tutor-schedule__summary-icon total">
            <span className="material-symbols-outlined">calendar_today</span>
          </div>
          <div className="tutor-schedule__summary-details">
            <h4>Tổng buổi dạy</h4>
            <p>{stats.total}</p>
          </div>
        </div>

        <div className="tutor-schedule__summary-card">
          <div className="tutor-schedule__summary-icon pending">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <div className="tutor-schedule__summary-details">
            <h4>Chờ xác nhận</h4>
            <p>{stats.pending}</p>
          </div>
        </div>

        <div className="tutor-schedule__summary-card">
          <div className="tutor-schedule__summary-icon confirmed">
            <span className="material-symbols-outlined">event_available</span>
          </div>
          <div className="tutor-schedule__summary-details">
            <h4>Đã xác nhận</h4>
            <p>{stats.confirmed}</p>
          </div>
        </div>

        <div className="tutor-schedule__summary-card">
          <div className="tutor-schedule__summary-icon completed">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div className="tutor-schedule__summary-details">
            <h4>Hoàn thành</h4>
            <p>{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Main Calendar Card */}
      <div className="tutor-card" style={{ overflow: "hidden" }}>
        
        {/* Navigation & Controls header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--tutor-border)" }}>
          <div className="tutor-schedule__calendar-nav">
            <button className="tutor-btn tutor-btn--ghost" onClick={handlePrevMonth} style={{ padding: "8px 12px" }}>
              <span className="material-symbols-outlined" style={{ verticalAlign: "middle" }}>chevron_left</span>
            </button>
            <button className="tutor-btn tutor-btn--ghost" onClick={handleGoToday} style={{ padding: "8px 14px", fontSize: 13 }}>
              Hôm nay
            </button>
            <button className="tutor-btn tutor-btn--ghost" onClick={handleNextMonth} style={{ padding: "8px 12px" }}>
              <span className="material-symbols-outlined" style={{ verticalAlign: "middle" }}>chevron_right</span>
            </button>
          </div>

          <div className="tutor-schedule__calendar-title">
            Tháng {month + 1}, {year}
          </div>

          <div style={{ width: 140 }}></div> {/* spacer balance */}
        </div>

        {/* Calendar Color Legends */}
        <div className="tutor-schedule__legend">
          <div className="tutor-schedule__legend-item">
            <div className="tutor-schedule__legend-dot pending"></div>
            <span>Chờ xác nhận</span>
          </div>
          <div className="tutor-schedule__legend-item">
            <div className="tutor-schedule__legend-dot confirmed"></div>
            <span>Đã xác nhận</span>
          </div>
          <div className="tutor-schedule__legend-item">
            <div className="tutor-schedule__legend-dot completed"></div>
            <span>Đã học xong</span>
          </div>
          <div className="tutor-schedule__legend-item">
            <div className="tutor-schedule__legend-dot cancelled"></div>
            <span>Đã hủy</span>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="tutor-schedule__weekdays">
          {weekdays.map((day) => (
            <div key={day} className="tutor-schedule__weekday">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid cells */}
        {loading ? (
          <div className="tutor-state">
            <div className="skeleton-card" style={{ height: "400px", margin: "10px" }}></div>
          </div>
        ) : error ? (
          <div className="tutor-state">
            <span className="material-symbols-outlined tutor-state__icon" style={{ color: "var(--tutor-error)" }}>error</span>
            <h3 className="tutor-state__title">Không thể tải dữ liệu</h3>
            <p className="tutor-state__text">{error}</p>
            <button className="tutor-btn tutor-btn--primary" onClick={loadBookings} style={{ marginTop: 12 }}>
              Thử lại
            </button>
          </div>
        ) : (
          <div className="tutor-schedule__grid">
            {calendarCells.map((cell, index) => {
              const cellBookings = getBookingsForCell(cell.date);
              const today = new Date();
              const isToday = isSameDay(cell.date, today);
              
              return (
                <div
                  key={index}
                  className={`tutor-schedule__day ${!cell.isCurrentMonth ? "tutor-schedule__day--inactive" : ""} ${isToday ? "tutor-schedule__day--today" : ""}`}
                >
                  <span className="tutor-schedule__day-num">{cell.dayNum}</span>

                  <div className="tutor-schedule__events">
                    {cellBookings.map((booking) => {
                      const statusStyle = STATUS_LABELS[booking.status] || { class: "pending" };
                      
                      return (
                        <div
                          key={booking.id}
                          className={`tutor-schedule__event tutor-schedule__event--${statusStyle.class}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                          }}
                          title={`${booking.classTitle} (${formatTimeSlot(booking.startTime, booking.endTime)})`}
                        >
                          <div className="tutor-schedule__event-title">{booking.classTitle}</div>
                          <div className="tutor-schedule__event-time">
                            <span className="material-symbols-outlined" style={{ fontSize: "10px" }}>schedule</span>
                            {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="tutor-modal" onClick={() => setSelectedBooking(null)}>
          <div className="tutor-modal__content" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
            <div className="tutor-schedule__modal-title-sec">
              <h3>Chi tiết buổi dạy</h3>
              <button 
                style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}
                onClick={() => setSelectedBooking(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="tutor-schedule__modal-body">
              {/* Status Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span 
                  className={`tutor-badge tutor-badge--${(STATUS_LABELS[selectedBooking.status] || { class: "pending" }).class}`}
                  style={{ textTransform: "none", fontSize: 13, padding: "6px 12px" }}
                >
                  {selectedBooking.statusText || (STATUS_LABELS[selectedBooking.status] || {}).text}
                </span>

                <span style={{ fontSize: 12, color: "var(--tutor-muted)", fontWeight: 600 }}>
                  ID Lịch: #{selectedBooking.id}
                </span>
              </div>

              {/* Class information section */}
              <div className="tutor-schedule__modal-section">
                <h4>Thông tin lớp học</h4>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--tutor-text)", marginBottom: 4 }}>
                  {selectedBooking.classTitle}
                </div>
                <div style={{ fontSize: 13, color: "var(--tutor-muted)", fontWeight: 600, display: "flex", gap: 10 }}>
                  <span>Môn học: {selectedBooking.subjectName}</span>
                  <span>•</span>
                  <span>Học phí: {selectedBooking.pricePerSession?.toLocaleString("vi-VN")}đ/buổi</span>
                </div>
              </div>

              {/* Teaching slot details */}
              <div className="tutor-schedule__modal-section">
                <h4>Thời gian giảng dạy</h4>
                <div className="tutor-schedule__modal-grid">
                  <div className="tutor-schedule__modal-item">
                    <label>Ngày học</label>
                    <span>{formatDate(selectedBooking.startTime)}</span>
                  </div>
                  <div className="tutor-schedule__modal-item">
                    <label>Khung giờ</label>
                    <span>{formatTimeSlot(selectedBooking.startTime, selectedBooking.endTime)}</span>
                  </div>
                  <div className="tutor-schedule__modal-item" style={{ marginTop: 8 }}>
                    <label>Thời lượng</label>
                    <span>{selectedBooking.durationMinutes} phút</span>
                  </div>
                  <div className="tutor-schedule__modal-item" style={{ marginTop: 8 }}>
                    <label>Ngày đặt lịch</label>
                    <span>{new Date(selectedBooking.bookingDate).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </div>

              {/* Student info */}
              <div className="tutor-schedule__modal-section">
                <h4>Học viên đăng ký</h4>
                <div className="tutor-schedule__student-info" style={{ marginBottom: selectedBooking.note ? 14 : 0 }}>
                  {getAvatarSrc({
                    avatarUrl:
                      selectedBooking.studentAvatar ??
                      selectedBooking.studentAvatarUrl ??
                      selectedBooking.avatarUrl ??
                      "",
                  }) ? (
                    <img
                      src={getAvatarSrc({
                        avatarUrl:
                          selectedBooking.studentAvatar ??
                          selectedBooking.studentAvatarUrl ??
                          selectedBooking.avatarUrl ??
                          "",
                      })}
                      alt={selectedBooking.studentName}
                      className="tutor-schedule__student-avatar"
                    />
                  ) : (
                    <div className="tutor-schedule__student-avatar tutor-schedule__student-avatar--fallback">
                      {getInitials(selectedBooking.studentName, "S")}
                    </div>
                  )}
                  <div className="tutor-schedule__student-meta">
                    <span className="tutor-schedule__student-name">{selectedBooking.studentName}</span>
                    <span className="tutor-schedule__student-sub">Học sinh đăng ký học</span>
                  </div>
                </div>

                {selectedBooking.note && (
                  <div style={{ borderTop: "1px solid var(--tutor-border)", paddingTop: 12 }}>
                    <label style={{ display: "block", fontSize: 11, color: "var(--tutor-muted)", fontWeight: 600, marginBottom: 4 }}>
                      Ghi chú từ học sinh:
                    </label>
                    <p className="tutor-schedule__note">{selectedBooking.note}</p>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons based on Status */}
              <div className="tutor-modal__actions" style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="tutor-btn tutor-btn--ghost"
                  onClick={() => setSelectedBooking(null)}
                >
                  Đóng
                </button>

                {/* If Pending (status === 1) */}
                {selectedBooking.status === 1 && (
                  <>
                    <button
                      type="button"
                      className="tutor-btn tutor-btn--danger"
                      disabled={submitting}
                      onClick={() => handleBookingAction(cancelBookingByTutor, selectedBooking.id, "Đã từ chối buổi học thành công!")}
                      style={{ background: "var(--tutor-error)", color: "#fff" }}
                    >
                      Từ chối
                    </button>
                    <button
                      type="button"
                      className="tutor-btn tutor-btn--primary"
                      disabled={submitting}
                      onClick={() => handleBookingAction(confirmBooking, selectedBooking.id, "Xác nhận lịch giảng dạy thành công!")}
                    >
                      {submitting ? "Đang xử lý..." : "Xác nhận dạy"}
                    </button>
                  </>
                )}

                {/* If Confirmed (status === 2) */}
                {selectedBooking.status === 2 && (
                  <>
                    <button
                      type="button"
                      className="tutor-btn tutor-btn--danger"
                      disabled={submitting}
                      onClick={() => handleBookingAction(cancelBookingByTutor, selectedBooking.id, "Đã hủy buổi học thành công!")}
                      style={{ background: "var(--tutor-error)", color: "#fff" }}
                    >
                      Hủy lịch học
                    </button>
                    <button
                      type="button"
                      className="tutor-btn tutor-btn--primary"
                      disabled={submitting}
                      onClick={() => handleBookingAction(completeBooking, selectedBooking.id, "Đã cập nhật trạng thái hoàn thành lớp học!")}
                      style={{ background: "var(--tutor-success)", color: "#fff" }}
                    >
                      {submitting ? "Đang xử lý..." : "Hoàn thành dạy"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
