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

  // Helper: Lấy các booking trong một ngày cụ thể (giả lập lịch tháng hiện tại)
  const getBookingsForDay = (dayNum) => {
    return bookings.filter(b => new Date(b.startTime).getDate() === dayNum);
  };

  return (
    <div>
      <div className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Lịch trình học tập</h1>
          <p className="student-dashboard__subtext">
            Xem và quản lý các buổi học của bạn.
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 3; // Giả sử tháng bắt đầu từ thứ 5 (index 3)
              const dayBookings = dayNum > 0 && dayNum <= 31 ? getBookingsForDay(dayNum) : [];
              
              return (
                <div
                  key={i}
                  style={{
                    minHeight: "140px",
                    borderRight: "1px solid var(--color-border)",
                    borderBottom: "1px solid var(--color-border)",
                    padding: "10px",
                    color: "var(--color-text-muted)",
                    fontSize: "13px",
                    background: dayNum === new Date().getDate() ? "#fffef0" : "transparent"
                  }}
                >
                  <span style={{ fontWeight: dayNum === new Date().getDate() ? 700 : 400 }}>
                    {dayNum > 0 && dayNum <= 31 ? dayNum : ""}
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