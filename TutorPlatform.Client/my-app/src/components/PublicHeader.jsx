import React from "react";
import { useNavigate } from "react-router-dom";
import "./PublicHeader.css";

const PublicHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="home-header">
      <div className="home-logo" onClick={() => navigate("/")}>
        <span className="home-logo-dot"></span>
        <h2>EduMatch</h2>
      </div>

      <nav className="home-nav">
        <button onClick={() => navigate("/")}>Trang chủ</button>
        <button onClick={() => navigate("/tutors")}>Gia sư nổi bật</button>
        <button onClick={() => navigate("/classes")}>Lớp nhóm</button>
        <button onClick={() => navigate("/about")}>Giới thiệu</button>
        <button onClick={() => navigate("/support")}>Hỗ trợ</button>
      </nav>

      <div className="home-auth">
        <button className="auth-btn login-btn" onClick={() => navigate("/login")}>
          Đăng nhập
        </button>
        <button className="auth-btn register-btn" onClick={() => navigate("/register")}>
          Đăng ký ngay
        </button>
      </div>
    </header>
  );
};

export default PublicHeader;
