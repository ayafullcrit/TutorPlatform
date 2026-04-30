import { useState, useEffect } from "react";
import StatCard from "../../components/student/StatCard";
import { getStudentStats, getChartData } from "../../services/dashboardService";
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
      // Get student stats
      const statsData = await getStudentStats();
      if (statsData.data) {
        setStats({
          courses: statsData.data.totalCourses || 0,
          hours: statsData.data.totalHours || "0h",
          rating: statsData.data.averageRating || 0,
          attendance: statsData.data.attendanceRate || 0,
        });
      }

      // Get upcoming bookings
      const bookingsData = await getStudentBookings();
      if (bookingsData.data) {
        setBookings(bookingsData.data.slice(0, 2));
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
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
        <StatCard 
          icon="menu_book" 
          title="Khóa học" 
          value={stats.courses} 
          trend="+12%" 
        />
        <StatCard 
          icon="schedule" 
          title="Giờ học" 
          value={stats.hours} 
          trend="+12%" 
        />
        <StatCard 
          icon="star" 
          title="Đánh giá" 
          value={stats.rating} 
          trend="+12%" 
        />
        <StatCard 
          icon="trending_up" 
          title="Điểm chuyên cần" 
          value={`${stats.attendance}%`} 
          trend="+12%" 
        />
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
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span>CN</span>
          </div>
        </div>

        <div className="student-card student-dashboard__schedule-card">
          <div className="student-card__header">
            <h3 className="student-card__title">Lịch sắp tới</h3>
            <span className="student-card__link">Tất cả</span>
          </div>

          <div className="student-dashboard__schedule-list">
            {loading ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                Đang tải...
              </div>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="student-dashboard__schedule-item">
                  <div className="student-dashboard__schedule-date">
                    <span>{new Date(booking.bookingDate).toLocaleDateString('vi-VN', { weekday: 'short' })}</span>
                    <strong>{new Date(booking.bookingDate).getDate()}</strong>
                  </div>
                  <div>
                    <div className="student-dashboard__schedule-subject">
                      {booking.class?.subject || "Học với gia sư"}
                    </div>
                    <div className="student-dashboard__schedule-time">
                      {new Date(booking.bookingDate).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
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