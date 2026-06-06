import { useState, useEffect } from "react";
import TutorStatCard from "../../components/tutor/TutorStatCard";
import TutorChartCard from "../../components/tutor/TutorChartCard";
import { getTutorBookings } from "../../services/bookingService";
import { getTutorStats } from "../../services/dashboardService";

export default function Dashboard() {
  const [tutorStats, setTutorStats] = useState([
    { label: "Nhóm đang dạy",       value: 0,    icon: "class" },
    { label: "Học viên",            value: 0,    icon: "person" },
    { label: "Thu nhập tháng",      value: "₫0", icon: "trending_up" },
    { label: "Đánh giá trung bình", value: 0,    icon: "star" },
  ]);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      let statsResult = null;
      let bookingsData = null;

      try {
        statsResult = await getTutorStats();
      } catch (error) {
        console.error("Failed to fetch tutor stats:", error);
      }

      try {
        bookingsData = await getTutorBookings();
      } catch (error) {
        console.error("Failed to fetch tutor bookings:", error);
      }

      if (statsResult && (statsResult.success === true || statsResult.Success === true) && statsResult.data) {
        const d = statsResult.data;
        setTutorStats([
          { label: "Lớp đang dạy",       value: d.activeClasses || d.ActiveClasses || 0,                     icon: "class" },
          { label: "Học viên",            value: d.totalStudents || d.TotalStudents || 0,                      icon: "person" },
          { label: "Thu nhập tháng",      value: `₫${(d.monthlyEarnings ?? d.MonthlyEarnings ?? 0).toLocaleString("vi-VN")}`, icon: "trending_up" },
          { label: "Đánh giá trung bình", value: (d.averageRating ?? d.AverageRating ?? 0) === 0 ? 0 : (d.averageRating ?? d.AverageRating),              icon: "star" },
        ]);
      }

      if (bookingsData && (bookingsData.success === true || bookingsData.Success === true) && bookingsData.data) {
        const allBookings = bookingsData.data;
        
        // Upcoming Confirmed
        const upcoming = allBookings
          .filter(b => b.status === 2 && new Date(b.startTime) > new Date())
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
          .slice(0, 5)
          .map(b => ({
            id: b.id,
            subject: b.subjectName || b.classTitle || "Không xác định",
            studentName: b.studentName,
            date: new Date(b.startTime).toLocaleDateString("vi-VN"),
            time: new Date(b.startTime).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
        setUpcomingLessons(upcoming);

        // Pending Requests
        setPendingBookings(allBookings.filter(b => b.status === 1));
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      let result;
      if (action === "confirm") {
        result = await import("../../services/bookingService").then(m => m.confirmBooking(id));
      } else {
        result = await import("../../services/bookingService").then(m => m.cancelBookingByTutor(id));
      }

      if (result.success) {
        alert("Thao tác thành công!");
        loadDashboardData();
      } else {
        alert(result.message || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi kết nối");
    }
  };

  return (
    <div>
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Chào mừng trở lại!</h1>
          <p className="tutor-page__subtitle">Đây là hiệu suất dạy học của bạn trong tháng này.</p>
        </div>
      </div>

      <section className="tutor-dashboard__stats">
        {loading ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "20px" }}>
            Đang tải...
          </div>
        ) : (
          tutorStats.map((item) => (
            <TutorStatCard key={item.label} {...item} />
          ))
        )}
      </section>

      {/* Pending Requests Section */}
      {pendingBookings.length > 0 && (
        <section className="tutor-dashboard__pending tutor-card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Yêu cầu đặt lịch mới ({pendingBookings.length})</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {pendingBookings.map(b => (
              <div key={b.id} style={{ border: "1px solid #f0f0f0", padding: 16, borderRadius: 12, background: "#fffaf0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <strong>{b.studentName}</strong>
                  <span style={{ fontSize: 12, color: "#666" }}>{new Date(b.bookingDate).toLocaleDateString("vi-VN")}</span>
                </div>
                <p style={{ fontSize: 13, marginBottom: 4 }}>Lớp: {b.classTitle}</p>
                <p style={{ fontSize: 13, marginBottom: 8 }}>Lịch: {new Date(b.startTime).toLocaleString("vi-VN")}</p>
                {b.note && <p style={{ fontSize: 12, color: "#888", fontStyle: "italic", marginBottom: 12 }}>"{b.note}"</p>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button 
                    onClick={() => handleAction(b.id, "confirm")}
                    style={{ flex: 1, padding: "6px", borderRadius: 6, border: "none", background: "#7C6E27", color: "#fff", cursor: "pointer" }}
                  >
                    Xác nhận
                  </button>
                  <button 
                    onClick={() => handleAction(b.id, "cancel")}
                    style={{ flex: 1, padding: "6px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="tutor-dashboard__grid">
        <TutorChartCard />

        <div className="tutor-upcoming tutor-card">
          <div className="tutor-chart__header">
            <h3>Lịch dạy sắp tới</h3>
            <span style={{ color: "var(--tutor-primary)", fontWeight: 700 }}>Xem tất cả</span>
          </div>

          <div style={{ marginTop: 22 }}>
            {loading ? (
              <div style={{ padding: "20px", textAlign: "center" }}>Đang tải...</div>
            ) : upcomingLessons.length > 0 ? (
              upcomingLessons.map((item, idx) => (
                <div className="tutor-upcoming__item" key={idx}>
                  <div className="tutor-upcoming__date">{item.date}</div>
                  <div>
                    <div className="tutor-upcoming__subject">{item.subject}</div>
                    <div className="tutor-upcoming__time">
                      {item.time}
                      {item.studentName && (
                        <span style={{ marginLeft: 8, color: "#999", fontSize: 12 }}>
                          · {item.studentName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                Không có lịch dạy sắp tới
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}