import { useState, useEffect } from "react";
import { getStudentBookings, cancelBookingByStudent } from "../../services/bookingService";

export default function Schedule() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const days = ["THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7", "CHỦ NHẬT"];

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const result = await getStudentBookings();
      if (result.success) {
        setBookings(result.data);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch học này? Hủy sau khi xác nhận có thể bị trừ phí.")) return;
    
    try {
      const result = await cancelBookingByStudent(id);
      if (result.success) {
        alert("Đã hủy lịch học thành công!");
        loadBookings();
      } else {
        alert(result.message || "Không thể hủy lịch học");
      }
    } catch (error) {
      alert("Lỗi khi hủy lịch học");
    }
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Lấy các booking trong một ngày cụ thể
  const getBookingsForDate = (date) => {
    if (!date) return [];
    return bookings.filter(b => {
      const bDate = new Date(b.startTime);
      return bDate.getDate() === date.getDate() && 
             bDate.getMonth() === date.getMonth() && 
             bDate.getFullYear() === date.getFullYear();
    });
  };

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOffset = (y, m) => {
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const calendarCells = [];
  const daysCount = getDaysInMonth(currentYear, currentMonth);
  const startOffset = getFirstDayOffset(currentYear, currentMonth);

  // Thêm khoảng trống tháng trước
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push(null);
  }

  // Thêm ngày tháng hiện tại
  for (let d = 1; d <= daysCount; d++) {
    calendarCells.push(new Date(currentYear, currentMonth, d));
  }

  // Padding tháng sau cho đủ dòng
  const totalCells = calendarCells.length <= 35 ? 35 : 42;
  const padCount = totalCells - calendarCells.length;
  for (let d = 0; d < padCount; d++) {
    calendarCells.push(null);
  }

  return (
    <div>
      <div className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Lịch trình học tập</h1>
          <p className="student-dashboard__subtext">
            Tháng {currentMonth + 1}/{currentYear} - Xem và quản lý các buổi học của bạn.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>Đang tải lịch học...</div>
      ) : (
        <div className="student-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid var(--color-border)" }}>
            {days.map((day) => (
              <div
                key={day}
                style={{
                  padding: "14px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  borderRight: "1px solid var(--color-border)",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gridAutoRows: "140px" }}>
            {calendarCells.map((dateObj, i) => {
              const isToday = dateObj && 
                dateObj.getDate() === today.getDate() && 
                dateObj.getMonth() === today.getMonth();
              
              const dayBookings = getBookingsForDate(dateObj);
              
              return (
                <div
                  key={i}
                  style={{
                    height: "140px",
                    minHeight: 0,
                    boxSizing: "border-box",
                    overflowX: "hidden",
                    overflowY: "auto",
                    borderRight: "1px solid var(--color-border)",
                    borderBottom: "1px solid var(--color-border)",
                    padding: "10px",
                    color: "var(--color-text-muted)",
                    fontSize: "13px",
                    background: isToday ? "#fffef0" : "transparent"
                  }}
                >
                  <span style={{ fontWeight: isToday ? 700 : 400 }}>
                    {dateObj ? dateObj.getDate() : ""}
                  </span>
                  
                  {dayBookings.map(b => (
                    <div
                      key={b.id}
                      title={b.note}
                      style={{
                        marginTop: "8px",
                        background: b.status === 4 ? "#fce8e6" : b.status === 2 ? "#e6f4ea" : "#fff8e1",
                        color: b.status === 4 ? "#d93025" : b.status === 2 ? "#1e8e3e" : "#f57c00",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 600,
                        position: "relative"
                      }}
                    >
                      <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {b.classTitle}
                      </div>
                      <div style={{ fontSize: "10px", opacity: 0.8 }}>
                        {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {b.status !== 4 && b.status !== 3 && (
                        <button 
                          onClick={() => handleCancel(b.id)}
                          style={{
                            border: "none", background: "none", color: "inherit", 
                            padding: 0, fontSize: "10px", textDecoration: "underline",
                            marginTop: "4px", cursor: "pointer"
                          }}
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
