

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [realStats, setRealStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5102/api/dashboard/public/stats");
      const result = await response.json();
      if (result.success) {
        setRealStats(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch public stats:", error);
    }
  };
  const stats = [
    {
      number: realStats ? `${realStats.totalTutors}+` : "850+",
      title: "Gia sư được xác thực",
      borderColor: "#5E9C59",
      icon: "🎓",
    },
    {
      number: realStats ? `${realStats.totalStudents}+` : "4200+",
      title: "Học viên",
      borderColor: "#4D8AD6",
      icon: "🪪",
    },
    {
      number: realStats ? `${realStats.totalClasses}+` : "1500+",
      title: "Môn dạy ",
      borderColor: "#E39A39",
      icon: "🏫",
    },
    {
      number: "4.9",
      title: "Đánh giá",
      borderColor: "#8B58B8",
      icon: "★★★★★",
    },
  ];

  return (
    <div className="home-page" style={styles.page}>
      <div className="home-page__texture"></div>

      <header className="home-header" style={styles.header}>
        <div style={styles.logoWrap}>
          <span style={styles.logoDot}></span>
          <h2 style={styles.logoText}>EduMatch</h2>
        </div>

        <nav style={styles.nav}>
          <button style={styles.navLink} onClick={() => navigate("/")}>
            Trang chủ
          </button>
          <button style={styles.navLink} onClick={() => navigate("/tutors")}>
            Gia sư nổi bật
          </button>
          <button style={styles.navLink} onClick={() => navigate("/classes")}>
            Môn giảng dạy
          </button>
          <button style={styles.navLink} onClick={() => navigate("/about")}>
            Giới thiệu
          </button>
          <button style={styles.navLink} onClick={() => navigate("/support")}>
            Hỗ trợ
          </button>
        </nav>

        <div style={styles.authButtons}>
          <button
            className="auth-btn login-btn"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>

          <button
            className="auth-btn register-btn"
            onClick={() => navigate("/register")}
          >
            Đăng ký ngay
          </button>
        </div>
      </header>

      <main className="home-main" style={styles.main}>
        <section className="home-left" style={styles.leftSection}>
          <div style={styles.badge}>Nền tảng gia sư #1 Việt Nam</div>

          <h1 style={styles.title}>
            Tìm kiếm Gia sư
            <br />
            giỏi nhất cho bạn
          </h1>

          <p style={styles.description}>
            Nâng cao kiến thức và kết nối với hàng nghìn gia sư uy tín trên cả
            nước.
          </p>

          <div style={styles.heroButtons}>
            <button
              className="home-hero-btn home-hero-btn--primary"
              onClick={() => navigate("/tutors")}
            >
              Gia sư nổi bật
            </button>

            <button
              className="home-hero-btn home-hero-btn--secondary"
              onClick={() => navigate("/classes")}
            >
              Môn giảng dạy
            </button>
          </div>
        </section>

        <section className="home-right" style={styles.rightSection}>
          <div className="home-visual">
            <div className="home-visual__circle">
              <img
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=80"
                alt="Gia sư và học viên"
                className="home-visual__image"
              />
            </div>

            {stats.map((item, index) => (
              <div
                key={index}
                className={`home-stat-card home-stat-card--${index + 1}`}
                style={{
                  borderTop: `8px solid ${item.borderColor}`,
                }}
              >
                <div className="home-stat-card__icon">{item.icon}</div>
                <h2 style={styles.statNumber}>{item.number}</h2>
                <p style={styles.statTitle}>{item.title}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    color: "#111",
    position: "relative",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "22px 48px",
    flexWrap: "wrap",
    gap: "16px",
    position: "relative",
    zIndex: 2,
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logoDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#2B8A5B",
  },

  logoText: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    fontFamily: "Poppins, sans-serif",
    color: "#16213E",
    letterSpacing: "0.5px",
  },

  nav: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  navLink: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#2f2a22",
    fontWeight: "500",
  },

  authButtons: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  main: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "50px 60px 70px",
    gap: "48px",
    flexWrap: "wrap",
    position: "relative",
    zIndex: 2,
  },

  leftSection: {
    flex: "1",
    minWidth: "320px",
    maxWidth: "560px",
  },

  badge: {
    display: "inline-block",
    padding: "12px 20px",
    backgroundColor: "#E8E2C7",
    color: "#7C6E27",
    borderRadius: "999px",
    fontSize: "18px",
    marginBottom: "28px",
    fontWeight: "500",
  },

  title: {
    fontSize: "68px",
    lineHeight: "1.08",
    margin: "0 0 24px 0",
    fontWeight: "800",
    fontFamily: "Playfair Display, serif",
    color: "#131313",
  },

  description: {
    fontSize: "22px",
    lineHeight: "1.55",
    color: "#3b342d",
    marginBottom: "34px",
    maxWidth: "560px",
  },

  heroButtons: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },

  rightSection: {
    flex: "1",
    minWidth: "360px",
    display: "flex",
    justifyContent: "center",
  },

  statNumber: {
    fontSize: "48px",
    margin: "10px 0 6px 0",
    fontFamily: "Inter, sans-serif",
    fontWeight: "800",
    color: "#111",
  },

  statTitle: {
    fontSize: "18px",
    lineHeight: "1.4",
    margin: 0,
    color: "#222",
    fontWeight: "500",
  },
};

export default Home;
