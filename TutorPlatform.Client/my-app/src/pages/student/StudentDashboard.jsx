import { useState, useEffect } from "react";
import StatCard from "../../components/student/StatCard";
import { getStudentStats } from "../../services/dashboardService";
import { getStudentBookings } from "../../services/bookingService";

export default function Dashboard() {
  const [stats, setStats] = useState({
    courses: 0,
    hours: "0h",
    rating: 0,
    attendance: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch both stats and bookings
      const [statsData, bookingsData] = await Promise.all([
        getStudentStats(),
        getStudentBookings()
      ]);

      // Handle Bookings & Manual Stats Fallback
      if (bookingsData?.success && bookingsData.data) {
        const allBookings = bookingsData.data;
        setBookings(allBookings.slice(0, 5)); // Show more than 2

        const completedBookings = allBookings.filter(b => b.status === 3);
        const uniqueClasses = new Set(allBookings.map(b => b.classId)).size;

        // Set initial stats from bookings
        setStats({
          courses: uniqueClasses,
          hours: `${completedBookings.length * 1.5 | 0}h`,
          rating: 0,
          attendance: allBookings.length > 0
            ? Math.round((completedBookings.length / allBookings.length) * 100)
            : 0,
        });
      }

      // Overwrite with dedicated stats API if available
      if (statsData?.success && statsData.data) {
        const d = statsData.data;
        setStats(prev => ({
          courses: d.totalCourses ?? prev.courses,
          hours: `${d.totalHours ?? 0}h`,
          rating: d.averageRating ?? prev.rating,
          attendance: d.attendanceRate ?? prev.attendance,
        }));
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // BookingStatus: Pending=1, Confirmed=2, Completed=3, Cancelled=4, NoShow=5
  const statusText = {
    1: "Chờ xác nhận",
    2: "Đã xác nhận",
    3: "Hoàn thành",
    4: "Đã hủy",
    5: "Không đến",
  };

  return (
    <div className="student-dashboard">
      <section className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Chào bạn trở lại!</h1>
          <p className="student-dashboard__subtext">
            Đây là tiến trình học tập của bạn trong tuần này.
          </p>
        </div>

        <button className="student-dashboard__primary-btn">
          <span className="material-symbols-outlined">calendar_month</span>
          Lịch học
        </button>
      </section>

      <section className="student-dashboard__stats">
        <StatCard icon="menu_book" title="Khóa học" value={stats.courses} trend="+12%" />
        <StatCard icon="schedule" title="Giờ học" value={stats.hours} trend="+12%" />
        <StatCard icon="star" title="Đánh giá" value={stats.rating || "--"} trend="+12%" />
        <StatCard icon="trending_up" title="Điểm chuyên cần" value={`${stats.attendance}%`} trend="+12%" />
      </section>

      <section className="student-dashboard__grid">
        <div className="student-card student-dashboard__chart-card">
          <div className="student-card__header">
            <h3 className="student-card__title">Hoạt động hàng tuần</h3>
            <span className="student-card__muted">6 tháng qua</span>
          </div>

          <div className="student-dashboard__chart">
            <svg viewBox="0 0 600 240" preserveAspectRatio="none">
              <path
                d="M20,170 C80,110 130,110 180,145 C230,180 280,70 340,120 C390,165 420,200 485,80 C530,10 560,100 590,195"
                fill="none"
                stroke="#7C6E27"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="student-dashboard__chart-labels">
            <span>T3</span><span>T4</span><span>T5</span>
            <span>T6</span><span>T7</span><span>CN</span>
          </div>
        </div>

        <div className="student-card student-dashboard__schedule-card">
          <div className="student-card__header">
            <h3 className="student-card__title">Lịch sắp tới</h3>
            <span className="student-card__link">Tất cả</span>
          </div>

          <div className="student-dashboard__schedule-list">
            {loading ? (
              <div style={{ padding: "20px", textAlign: "center" }}>Đang tải...</div>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="student-dashboard__schedule-item">
                  <div className="student-dashboard__schedule-date">
                    <span>{new Date(booking.startTime).toLocaleDateString("vi-VN", { weekday: "short" })}</span>
                    <strong>{new Date(booking.startTime).getDate()}</strong>
                  </div>
                  <div>
                    <div className="student-dashboard__schedule-subject">
                      {booking.subjectName || booking.classTitle || "Học với gia sư"}
                    </div>
                    <div className="student-dashboard__schedule-time">
                      {new Date(booking.startTime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" · "}
                      <span style={{ fontSize: "12px", color: "#999" }}>
                        {statusText[booking.status] ?? ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                Không có lịch sắp tới
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}