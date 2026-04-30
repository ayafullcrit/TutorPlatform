import { useState, useEffect } from "react";
import TutorStatCard from "../../components/tutor/TutorStatCard";
import TutorChartCard from "../../components/tutor/TutorChartCard";
import { getTutorStats, getTutorRecentBookings } from "../../services/dashboardService";

export default function Dashboard() {
  const [tutorStats, setTutorStats] = useState([]);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Get tutor stats
      const statsData = await getTutorStats();
      if (statsData.data) {
        setTutorStats([
          {
            label: "Lớp đang dạy",
            value: statsData.data.activeClasses || 0,
            icon: "class",
          },
          {
            label: "Học viên",
            value: statsData.data.totalStudents || 0,
            icon: "person",
          },
          {
            label: "Thu nhập tháng",
            value: `₫${(statsData.data.monthlyIncome || 0).toLocaleString('vi-VN')}`,
            icon: "trending_up",
          },
          {
            label: "Đánh giá trung bình",
            value: statsData.data.averageRating || 0,
            icon: "star",
          },
        ]);
      }

      // Get recent bookings
      const bookingsData = await getTutorRecentBookings();
      if (bookingsData.data) {
        setUpcomingLessons(bookingsData.data.map((b) => ({
          subject: b.class?.subject || "Không xác định",
          date: new Date(b.bookingDate).toLocaleDateString('vi-VN'),
          time: new Date(b.bookingDate).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        })));
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Chào mừng trở lại!</h1>
          <p className="tutor-page__subtitle">
            Đây là hiệu suất dạy học của bạn trong tháng này.
          </p>
        </div>

        <button className="tutor-btn tutor-btn--primary">
          <span className="material-symbols-outlined">add_circle</span>
          Mở lớp mới
        </button>
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

      <section className="tutor-dashboard__grid">
        <TutorChartCard />

        <div className="tutor-upcoming tutor-card">
          <div className="tutor-chart__header">
            <h3>Lịch dạy sắp tới</h3>
            <span style={{ color: "var(--tutor-primary)", fontWeight: 700 }}>
              Xem tất cả
            </span>
          </div>

          <div style={{ marginTop: 22 }}>
            {upcomingLessons.length > 0 ? (
              upcomingLessons.map((item) => (
                <div className="tutor-upcoming__item" key={`${item.subject}-${item.date}`}>
                  <div className="tutor-upcoming__date">{item.date}</div>
                  <div>
                    <div className="tutor-upcoming__subject">{item.subject}</div>
                    <div className="tutor-upcoming__time">{item.time}</div>
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