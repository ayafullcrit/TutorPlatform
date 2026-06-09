import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTutorBookings,
  confirmBooking,
  completeBooking,
  cancelBookingByTutor,
} from "../../services/bookingService";
import { getMyAvailability, setMyAvailability } from "../../services/tutorService";
import { getAvatarSrc, getInitials } from "../../utils/avatar";
import WeeklyScheduleGrid from "../../components/shared/WeeklyScheduleGrid";



/** Expand availability range thành từng cell 1h */
function expandAvailabilityToCells(slots) {
  const cells = new Set();
  slots.forEach(({ dayOfWeek, startTime, endTime }) => {
    const [sh] = startTime.split(":").map(Number);
    const [eh] = endTime.split(":").map(Number);
    for (let h = sh; h < eh; h++) {
      cells.add(`${dayOfWeek}:${h}`);
    }
  });
  return cells;
}

/** Nén cells thành ranges theo từng day */
function compressCellsToRanges(cellSet) {
  // group by day
  const byDay = {};
  cellSet.forEach((key) => {
    const [dow, hour] = key.split(":").map(Number);
    if (!byDay[dow]) byDay[dow] = [];
    byDay[dow].push(hour);
  });

  const ranges = [];
  Object.entries(byDay).forEach(([dow, hours]) => {
    hours.sort((a, b) => a - b);
    let start = hours[0];
    let prev = hours[0];
    for (let i = 1; i < hours.length; i++) {
      if (hours[i] === prev + 1) {
        prev = hours[i];
      } else {
        ranges.push({
          dayOfWeek: Number(dow),
          startTime: `${String(start).padStart(2, "0")}:00`,
          endTime: `${String(prev + 1).padStart(2, "0")}:00`,
        });
        start = hours[i];
        prev = hours[i];
      }
    }
    ranges.push({
      dayOfWeek: Number(dow),
      startTime: `${String(start).padStart(2, "0")}:00`,
      endTime: `${String(prev + 1).padStart(2, "0")}:00`,
    });
  });
  return ranges;
}

/** Build busy cells từ bookings (datetime → dayOfWeek:hour) */
function buildBusyCells(bookings) {
  const cells = new Set();
  bookings.forEach((b) => {
    const s = new Date(b.startTime);
    const e = new Date(b.endTime);
    const dow = s.getDay();
    const sh = s.getHours();
    const eh = e.getHours() + (e.getMinutes() > 0 ? 1 : 0);
    for (let h = sh; h < eh; h++) {
      cells.add(`${dow}:${h}`);
    }
  });
  return cells;
}

export default function Schedule() {
  const navigate = useNavigate();

  // ── Tab state ──
  const [activeTab, setActiveTab] = useState("calendar"); // "calendar" | "availability"

  // ── Calendar state ──
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ── Availability state ──
  const [availLoading, setAvailLoading] = useState(false);
  const [availSaving, setAvailSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [markedCells, setMarkedCells] = useState(new Set());
  const [savedCells, setSavedCells] = useState(new Set()); // cells đã lưu (để so sánh / reset)
  const [hasCustomAvailability, setHasCustomAvailability] = useState(false);

  const STATUS_LABELS = {
    1: { text: "Chờ xác nhận", class: "pending", color: "var(--tutor-pending)" },
    2: { text: "Đã xác nhận", class: "confirmed", color: "var(--tutor-success)" },
    3: { text: "Hoàn thành", class: "completed", color: "#0077b6" },
    4: { text: "Đã hủy", class: "cancelled", color: "var(--tutor-error)" },
    5: { text: "Không đến", class: "cancelled", color: "var(--tutor-muted)" },
  };

  // ── Load bookings ──
  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTutorBookings();
      if (result?.success && result.data) {
        setBookings(result.data);
      } else {
        setError(result?.message || "Không thể tải danh sách lịch học");
      }
    } catch {
      setError("Đã xảy ra lỗi kết nối với máy chủ");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load availability ──
  const loadAvailability = useCallback(async () => {
    setAvailLoading(true);
    try {
      const res = await getMyAvailability();
      if (res?.success && res.data) {
        const slots = res.data;
        if (slots.length > 0) {
          const cells = expandAvailabilityToCells(slots);
          setMarkedCells(new Set(cells));
          setSavedCells(new Set(cells));
          setHasCustomAvailability(true);
        } else {
          // Chưa đánh dấu → dùng "không có lịch dạy = rảnh" mặc định
          setMarkedCells(new Set());
          setSavedCells(new Set());
          setHasCustomAvailability(false);
        }
      }
    } catch (e) {
      console.error("Failed to load availability:", e);
    } finally {
      setAvailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    if (activeTab === "availability") {
      loadAvailability();
    }
  }, [activeTab, loadAvailability]);

  // ── Toggle cell trong chế độ chỉnh sửa ──
  const handleToggleCell = (jsDow, hour) => {
    const key = `${jsDow}:${hour}`;
    setMarkedCells((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // ── Lưu lịch rảnh ──
  const handleSaveAvailability = async () => {
    const ranges = compressCellsToRanges(markedCells);
    setAvailSaving(true);
    try {
      const res = await setMyAvailability(ranges);
      if (res?.success) {
        setSavedCells(new Set(markedCells));
        setHasCustomAvailability(markedCells.size > 0);
        setIsEditing(false);
        alert("Đã lưu lịch rảnh thành công!");
      } else {
        alert(res?.message || "Lưu lịch rảnh thất bại");
      }
    } catch {
      alert("Lỗi kết nối máy chủ");
    } finally {
      setAvailSaving(false);
    }
  };

  // ── Hủy chỉnh sửa ──
  const handleCancelEdit = () => {
    setMarkedCells(new Set(savedCells));
    setIsEditing(false);
  };

  // ── Xóa toàn bộ lịch rảnh (reset về mặc định) ──
  const handleClearAll = () => {
    setMarkedCells(new Set());
  };

  // ── Chọn tất cả giờ không bận ──
  const handleSelectAllFree = () => {
    const busy = buildBusyCells(bookings);
    const allFree = new Set();
    // 7 ngày (0-6), 7h-22h (15 slots)
    for (let dow = 0; dow <= 6; dow++) {
      for (let h = 7; h < 22; h++) {
        const key = `${dow}:${h}`;
        if (!busy.has(key)) allFree.add(key);
      }
    }
    setMarkedCells(allFree);
  };

  // ── Calendar helpers ──
  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  const currentMonthBookings = bookings.filter((b) => {
    const bDate = new Date(b.startTime);
    return bDate.getFullYear() === year && bDate.getMonth() === month;
  });

  const stats = {
    total: currentMonthBookings.length,
    pending: currentMonthBookings.filter((b) => b.status === 1).length,
    confirmed: currentMonthBookings.filter((b) => b.status === 2).length,
    completed: currentMonthBookings.filter((b) => b.status === 3).length,
  };

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const getBookingsForCell = (cellDate) =>
    bookings.filter((b) => isSameDay(new Date(b.startTime), cellDate));

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getDaysInPrevMonth = (y, m) => new Date(y, m, 0).getDate();
  const getFirstDayOffset = (y, m) => {
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const calendarCells = [];
  const daysCount = getDaysInMonth(year, month);
  const prevDaysCount = getDaysInPrevMonth(year, month);
  const startOffset = getFirstDayOffset(year, month);

  for (let i = startOffset - 1; i >= 0; i--) {
    const dayNum = prevDaysCount - i;
    calendarCells.push({ dayNum, date: new Date(year, month - 1, dayNum), isCurrentMonth: false });
  }
  for (let d = 1; d <= daysCount; d++) {
    calendarCells.push({ dayNum: d, date: new Date(year, month, d), isCurrentMonth: true });
  }
  const totalCells = calendarCells.length <= 35 ? 35 : 42;
  for (let d = 1; d <= totalCells - calendarCells.length; d++) {
    calendarCells.push({ dayNum: d, date: new Date(year, month + 1, d), isCurrentMonth: false });
  }

  const weekdays = ["THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7", "CHỦ NHẬT"];

  const formatTimeSlot = (startStr, endStr) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    return `${s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })} - ${e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`;
  };

  const formatDate = (startStr) =>
    new Date(startStr).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // ── Booking actions ──
  const handleBookingAction = async (actionFn, bookingId, successMsg) => {
    const isCancel = actionFn === cancelBookingByTutor;
    const isComplete = actionFn === completeBooking;

    if (isComplete) {
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking?.endTime && new Date() < new Date(booking.endTime)) {
        alert("Chỉ có thể hoàn thành buổi dạy sau khi thời gian buổi học kết thúc.");
        return;
      }
    }

    if (isCancel) {
      const ok = window.confirm("Bạn có chắc chắn muốn hủy lịch học này?");
      if (!ok) return;
    }

    try {
      setSubmitting(true);
      const result = await actionFn(bookingId);
      if (result?.success) {
        alert(successMsg);
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(
            result.data || {
              ...selectedBooking,
              status: isCancel ? 4 : actionFn === confirmBooking ? 2 : 3,
            }
          );
        }
        await loadBookings();
      } else {
        alert(result?.message || "Hành động thất bại");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi xử lý yêu cầu");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Busy cells cho availability grid ──
  const busyCells = buildBusyCells(bookings);

  // ── Render ──
  return (
    <div className="tutor-schedule__container">
      {/* Page Header */}
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Lịch trình giảng dạy</h1>
          <p className="tutor-page__subtitle">
            Theo dõi lịch dạy và quản lý thời gian rảnh của bạn.
          </p>
        </div>
        {activeTab === "calendar" && (
          <button
            className="tutor-btn tutor-btn--primary"
            onClick={() => navigate("/tutor/classes", { state: { createClass: true } })}
          >
            Thêm lịch dạy
          </button>
        )}
        {activeTab === "availability" && !isEditing && (
          <button
            className="tutor-btn tutor-btn--primary"
            onClick={() => setIsEditing(true)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: "middle" }}>edit</span>
            Chỉnh sửa lịch rảnh
          </button>
        )}
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

      {/* ── TABS ── */}
      <div className="wgrid-tabs">
        <button
          className={`wgrid-tab${activeTab === "calendar" ? " wgrid-tab--active" : ""}`}
          onClick={() => setActiveTab("calendar")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_month</span>
          Lịch dạy
        </button>
        <button
          className={`wgrid-tab${activeTab === "availability" ? " wgrid-tab--active" : ""}`}
          onClick={() => setActiveTab("availability")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>event_available</span>
          Lịch rảnh
        </button>
      </div>

      {/* ══════════════════════════════════════════
          TAB 1: LỊCH DẠY (Calendar hiện có)
          ══════════════════════════════════════════ */}
      {activeTab === "calendar" && (
        <div className="tutor-card" style={{ overflow: "hidden" }}>
          {/* Nav & controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--tutor-border)" }}>
            <div className="tutor-schedule__calendar-nav">
              <button className="tutor-btn tutor-btn--ghost" onClick={() => setCurrentViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} style={{ padding: "8px 12px" }}>
                <span className="material-symbols-outlined" style={{ verticalAlign: "middle" }}>chevron_left</span>
              </button>
              <button className="tutor-btn tutor-btn--ghost" onClick={() => setCurrentViewDate(new Date())} style={{ padding: "8px 14px", fontSize: 13 }}>
                Hôm nay
              </button>
              <button className="tutor-btn tutor-btn--ghost" onClick={() => setCurrentViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} style={{ padding: "8px 12px" }}>
                <span className="material-symbols-outlined" style={{ verticalAlign: "middle" }}>chevron_right</span>
              </button>
            </div>
            <div className="tutor-schedule__calendar-title">
              Tháng {month + 1}, {year}
            </div>
            <div style={{ width: 140 }} />
          </div>

          {/* Legend */}
          <div className="tutor-schedule__legend">
            <div className="tutor-schedule__legend-item"><div className="tutor-schedule__legend-dot pending" /><span>Chờ xác nhận</span></div>
            <div className="tutor-schedule__legend-item"><div className="tutor-schedule__legend-dot confirmed" /><span>Đã xác nhận</span></div>
            <div className="tutor-schedule__legend-item"><div className="tutor-schedule__legend-dot completed" /><span>Đã học xong</span></div>
            <div className="tutor-schedule__legend-item"><div className="tutor-schedule__legend-dot cancelled" /><span>Đã hủy</span></div>
          </div>

          {/* Weekdays */}
          <div className="tutor-schedule__weekdays">
            {weekdays.map((day) => (
              <div key={day} className="tutor-schedule__weekday">{day}</div>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="tutor-state">
              <div className="skeleton-card" style={{ height: "400px", margin: "10px" }} />
            </div>
          ) : error ? (
            <div className="tutor-state">
              <span className="material-symbols-outlined tutor-state__icon" style={{ color: "var(--tutor-error)" }}>error</span>
              <h3 className="tutor-state__title">Không thể tải dữ liệu</h3>
              <p className="tutor-state__text">{error}</p>
              <button className="tutor-btn tutor-btn--primary" onClick={loadBookings} style={{ marginTop: 12 }}>Thử lại</button>
            </div>
          ) : (
            <div className="tutor-schedule__grid">
              {calendarCells.map((cell, index) => {
                const cellBookings = getBookingsForCell(cell.date);
                const isToday = isSameDay(cell.date, new Date());
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
                            onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                            title={`${booking.classTitle} (${formatTimeSlot(booking.startTime, booking.endTime)})`}
                          >
                            <div className="tutor-schedule__event-title">{booking.classTitle}</div>
                            <div className="tutor-schedule__event-time">
                              <span className="material-symbols-outlined" style={{ fontSize: "10px" }}>schedule</span>
                              {new Date(booking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
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
      )}

      {/* ══════════════════════════════════════════
          TAB 2: LỊCH RẢNH
          ══════════════════════════════════════════ */}
      {activeTab === "availability" && (
        <div className="tutor-card" style={{ padding: "24px" }}>
          {/* Section header */}
          <div className="wgrid-avail-header">
            <div>
              <h3 className="wgrid-avail-title">Quản lý lịch rảnh</h3>
              <p className="wgrid-avail-desc">
                {hasCustomAvailability
                  ? "Lịch rảnh hiển thị dựa theo các ô bạn đã đánh dấu."
                  : "Chưa đánh dấu lịch rảnh. Mặc định: tất cả giờ không có lịch dạy là rảnh."}
              </p>
            </div>

            {/* Action buttons */}
            <div className="wgrid-avail-actions">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="tutor-btn tutor-btn--ghost"
                    onClick={handleClearAll}
                    title="Xóa toàn bộ đánh dấu"
                    style={{ fontSize: 13 }}
                  >
                    Xóa hết
                  </button>
                  <button
                    type="button"
                    className="tutor-btn tutor-btn--ghost"
                    onClick={handleSelectAllFree}
                    title="Đánh dấu tất cả giờ không bận"
                    style={{ fontSize: 13 }}
                  >
                    Chọn tất cả rảnh
                  </button>
                  <button
                    type="button"
                    className="tutor-btn tutor-btn--ghost"
                    onClick={handleCancelEdit}
                    disabled={availSaving}
                    style={{ fontSize: 13 }}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="tutor-btn tutor-btn--primary"
                    onClick={handleSaveAvailability}
                    disabled={availSaving}
                    style={{ fontSize: 13 }}
                  >
                    {availSaving ? (
                      <>
                        <span className="material-symbols-outlined wgrid-spinner" style={{ fontSize: 16, verticalAlign: "middle" }}>sync</span>
                        {" Đang lưu..."}
                      </>
                    ) : (
                      "Lưu lịch rảnh"
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="tutor-btn tutor-btn--primary"
                  onClick={() => setIsEditing(true)}
                  style={{ fontSize: 13 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: "middle" }}>edit</span>
                  {" Chỉnh sửa"}
                </button>
              )}
            </div>
          </div>

          {/* Info banner khi đang chỉnh sửa */}
          {isEditing && (
            <div
              style={{
                padding: "10px 16px",
                background: "rgba(124, 110, 39, 0.08)",
                border: "1px solid rgba(124, 110, 39, 0.2)",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#7C6E27",
                marginBottom: "14px",
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>info</span>
              Click vào ô để đánh dấu / bỏ đánh dấu lịch rảnh. Ô đỏ (đã có lịch dạy) không thể chỉnh sửa.
            </div>
          )}

          {/* Grid */}
          {availLoading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--tutor-muted)" }}>
              <span className="material-symbols-outlined wgrid-spinner" style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}>sync</span>
              Đang tải lịch rảnh...
            </div>
          ) : (
            <WeeklyScheduleGrid
              mode="tutor-edit"
              markedCells={markedCells}
              busyCells={busyCells}
              onToggleCell={handleToggleCell}
              isEditing={isEditing}
            />
          )}

          {/* Summary */}
          {!availLoading && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                background: "var(--tutor-surface-soft)",
                borderRadius: "10px",
                border: "1px solid var(--tutor-border)",
                fontSize: "13px",
                color: "var(--tutor-muted)",
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <span>
                <strong style={{ color: "var(--tutor-text)" }}>{markedCells.size}</strong> ô đã đánh dấu rảnh
              </span>
              <span>
                <strong style={{ color: "var(--tutor-text)" }}>{busyCells.size}</strong> ô đã có lịch dạy
              </span>
              {isEditing && savedCells.size !== markedCells.size && (
                <span style={{ color: "var(--tutor-pending)", fontWeight: 700 }}>
                  • Chưa lưu thay đổi
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── BOOKING DETAILS MODAL ── */}
      {selectedBooking && (
        <div className="tutor-modal" onClick={() => setSelectedBooking(null)}>
          <div className="tutor-modal__content" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
            <div className="tutor-schedule__modal-title-sec">
              <h3>Chi tiết buổi dạy</h3>
              <button style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }} onClick={() => setSelectedBooking(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="tutor-schedule__modal-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className={`tutor-badge tutor-badge--${(STATUS_LABELS[selectedBooking.status] || { class: "pending" }).class}`} style={{ textTransform: "none", fontSize: 13, padding: "6px 12px" }}>
                  {selectedBooking.statusText || (STATUS_LABELS[selectedBooking.status] || {}).text}
                </span>
                <span style={{ fontSize: 12, color: "var(--tutor-muted)", fontWeight: 600 }}>
                  ID Lịch: #{selectedBooking.id}
                </span>
              </div>

              <div className="tutor-schedule__modal-section">
                <h4>Thông tin lớp học</h4>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--tutor-text)", marginBottom: 4 }}>{selectedBooking.classTitle}</div>
                <div style={{ fontSize: 13, color: "var(--tutor-muted)", fontWeight: 600, display: "flex", gap: 10 }}>
                  <span>Môn học: {selectedBooking.subjectName}</span>
                  <span>•</span>
                  <span>Học phí: {selectedBooking.pricePerSession?.toLocaleString("vi-VN")}đ/buổi</span>
                </div>
              </div>

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

              <div className="tutor-schedule__modal-section">
                <h4>Học viên đăng ký</h4>
                <div className="tutor-schedule__student-info" style={{ marginBottom: selectedBooking.note ? 14 : 0 }}>
                  {getAvatarSrc({ avatarUrl: selectedBooking.studentAvatar ?? selectedBooking.studentAvatarUrl ?? selectedBooking.avatarUrl ?? "" }) ? (
                    <img src={getAvatarSrc({ avatarUrl: selectedBooking.studentAvatar ?? selectedBooking.studentAvatarUrl ?? selectedBooking.avatarUrl ?? "" })} alt={selectedBooking.studentName} className="tutor-schedule__student-avatar" />
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
                    <label style={{ display: "block", fontSize: 11, color: "var(--tutor-muted)", fontWeight: 600, marginBottom: 4 }}>Ghi chú từ học sinh:</label>
                    <p className="tutor-schedule__note">{selectedBooking.note}</p>
                  </div>
                )}
              </div>

              <div className="tutor-modal__actions" style={{ marginTop: 8 }}>
                <button type="button" className="tutor-btn tutor-btn--ghost" onClick={() => setSelectedBooking(null)}>Đóng</button>
                {selectedBooking.status === 1 && (
                  <>
                    <button type="button" className="tutor-btn tutor-btn--danger" disabled={submitting} onClick={() => handleBookingAction(cancelBookingByTutor, selectedBooking.id, "Đã từ chối buổi học thành công!")} style={{ background: "var(--tutor-error)", color: "#fff" }}>Từ chối</button>
                    <button type="button" className="tutor-btn tutor-btn--primary" disabled={submitting} onClick={() => handleBookingAction(confirmBooking, selectedBooking.id, "Xác nhận lịch giảng dạy thành công!")}>
                      {submitting ? "Đang xử lý..." : "Xác nhận dạy"}
                    </button>
                  </>
                )}
                {selectedBooking.status === 2 && (
                  <>
                    <button type="button" className="tutor-btn tutor-btn--danger" disabled={submitting} onClick={() => handleBookingAction(cancelBookingByTutor, selectedBooking.id, "Đã hủy buổi học thành công!")} style={{ background: "var(--tutor-error)", color: "#fff" }}>Hủy lịch học</button>
                    <button type="button" className="tutor-btn tutor-btn--primary" disabled={submitting} onClick={() => handleBookingAction(completeBooking, selectedBooking.id, "Đã cập nhật trạng thái hoàn thành lớp học!")} style={{ background: "var(--tutor-success)", color: "#fff" }}>
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
