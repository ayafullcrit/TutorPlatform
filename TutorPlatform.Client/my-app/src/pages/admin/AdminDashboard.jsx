import { useEffect, useMemo, useState } from "react";
import { getAdminStats } from "../../services/dashboardService";

const formatCurrency = (value) => `${Number(value ?? 0).toLocaleString("vi-VN")}đ`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAdminStats();
        if (response?.success) setStats(response.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const summaryCards = useMemo(() => {
    const data = stats?.stats ?? stats ?? {};
    const monthlyGrowth = stats?.monthlyGrowth ?? [];
    const latestGrowth = monthlyGrowth.at(-1)?.Count ?? monthlyGrowth.at(-1)?.count ?? 0;
    return [
      {
        label: "Tổng gia sư",
        value: data.totalTutors ?? data.TotalTutors ?? 0,
        icon: "school",
        tone: "teacher",
      },
      {
        label: "Tổng học viên",
        value: data.totalStudents ?? data.TotalStudents ?? 0,
        icon: "person",
        tone: "student",
      },
      {
        label: "Tổng doanh thu",
        value: formatCurrency(data.totalRevenue ?? data.TotalRevenue ?? 0),
        icon: "payments",
        tone: "revenue",
      },
      {
        label: "Phí nền tảng",
        value: `${(((stats?.platformFeeRate ?? 0) * 100) || 0).toFixed(0)}%`,
        icon: "percent",
        tone: "fee",
      },
      {
        label: "Tăng trưởng tháng này",
        value: latestGrowth,
        icon: "trending_up",
        tone: "growth",
      },
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="admin-dashboard__loading">
        <div className="admin-spinner" />
        <p>Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  return (
    <section className="admin-dashboard">
      <header className="admin-dashboard__hero">
        <div>
          <span className="admin-dashboard__eyebrow">Quản trị hệ thống</span>
          <h1 className="admin-dashboard__title">Bảng điều khiển admin</h1>
          <p className="admin-dashboard__subtitle">
            Theo dõi số lượng gia sư, học viên và doanh thu nền tảng trong một màn hình.
          </p>
        </div>

        <div className="admin-dashboard__hero-note">
          <span className="material-symbols-outlined">insights</span>
          <div>
            <strong>Tổng quan vận hành</strong>
            <span>Cập nhật theo dữ liệu thực từ backend</span>
          </div>
        </div>
      </header>

      <section className="admin-dashboard__grid">
        {summaryCards.map((card) => (
          <article key={card.label} className={`admin-dashboard__card admin-dashboard__card--${card.tone}`}>
            <div className="admin-dashboard__card-icon">
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <div>
              <p className="admin-dashboard__card-label">{card.label}</p>
              <h3 className="admin-dashboard__card-value">{card.value}</h3>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-dashboard__panel">
        <div className="admin-card">
          <div className="admin-page__header">
            <h2>Thông tin doanh thu</h2>
            <p>
              Giá trị doanh thu hiển thị là tổng tiền hệ thống thu được từ phí nền tảng.
            </p>
          </div>

          <div className="admin-dashboard__revenue">
            <div className="admin-dashboard__revenue-main">
              <span className="admin-dashboard__revenue-label">Tổng doanh thu</span>
              <strong>{formatCurrency(stats?.stats?.totalRevenue ?? stats?.totalRevenue ?? 0)}</strong>
            </div>

            <div className="admin-dashboard__revenue-meta">
              <div>
                <span>Gia sư đã duyệt</span>
                <strong>{stats?.stats?.totalTutors ?? stats?.totalTutors ?? 0}</strong>
              </div>
              <div>
                <span>Học viên đang hoạt động</span>
                <strong>{stats?.stats?.totalStudents ?? stats?.totalStudents ?? 0}</strong>
              </div>
              <div>
                <span>Phí nền tảng</span>
                <strong>{(((stats?.platformFeeRate ?? 0) * 100) || 0).toFixed(0)}%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-dashboard__mini-grid">
        <article className="admin-card admin-dashboard__mini-card">
          <span className="material-symbols-outlined">person_add</span>
          <div>
            <p>Người dùng mới tháng này</p>
            <strong>{stats?.monthlyGrowth?.at?.(-1)?.Count ?? stats?.monthlyGrowth?.at?.(-1)?.count ?? 0}</strong>
          </div>
        </article>
        <article className="admin-card admin-dashboard__mini-card">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <div>
            <p>Tổng lớp học</p>
            <strong>{stats?.stats?.totalClasses ?? stats?.totalClasses ?? 0}</strong>
          </div>
        </article>
      </section>
    </section>
  );
}
