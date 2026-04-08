import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import "./DashboardPage.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Load user error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="btn-logout">
          Đăng xuất
        </button>
      </div>

      <div className="dashboard-content">
        <div className="user-card">
          <div className="user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.fullName} />
            ) : (
              <div className="avatar-placeholder">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h2>{user.fullName}</h2>
          <p className="user-email">{user.email}</p>

          <div className="user-info">
            <div className="info-item">
              <span className="label">Vai trò:</span>
              <span className="value">
                {user.role === 1
                  ? "🎓 Học sinh"
                  : user.role === 2
                    ? "👨‍🏫 Gia sư"
                    : "👑 Admin"}
              </span>
            </div>

            <div className="info-item">
              <span className="label">Số điện thoại:</span>
              <span className="value">
                {user.phoneNumber || "Chưa cập nhật"}
              </span>
            </div>

            <div className="info-item">
              <span className="label">Số dư:</span>
              <span className="value">
                {user.balance?.toLocaleString()} VNĐ
              </span>
            </div>

            {user.role === 2 && (
              <div className="info-item">
                <span className="label">Trạng thái:</span>
                <span className="value">
                  {user.isTutorVerified ? "✅ Đã xác minh" : "⏳ Chờ xác minh"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="features-grid">
          {/* Tìm lớp học - ACTIVE */}
          <div className="feature-card">
            <h3>🔍 Tìm lớp học</h3>
            <p>Tìm kiếm lớp học phù hợp với nhu cầu của bạn</p>
            <button 
              className="btn-feature" 
              onClick={() => navigate('/classes')}
            >
              Khám phá ngay
            </button>
          </div>

          {/* Lớp học của tôi - ACTIVE CHO TUTOR */}
        <div className="feature-card">
            <h3>📚 {user.role === 2 ? 'Quản lý đặt lịch' : 'Lịch học của tôi'}</h3>
            <p>Quản lý các lớp học {user.role === 2 ? 'đã tạo' : 'đã đặt'}</p>
            <button className="btn-feature" onClick={() => navigate('/my-bookings')}>
                Xem ngay
            </button>
        </div>

          {/* Thanh toán */}
          <div className="feature-card">
            <h3>💳 Thanh toán</h3>
            <p>Xem lịch sử giao dịch và nạp tiền</p>
            <button className="btn-feature" disabled>
              Sắp ra mắt
            </button>
          </div>

          {/* Cài đặt */}
          <div className="feature-card">
            <h3>⚙️ Cài đặt</h3>
            <p>Cập nhật thông tin cá nhân</p>
            <button 
              className="btn-feature"
              onClick={() => navigate('/profile')}
            >
              Cài đặt Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;