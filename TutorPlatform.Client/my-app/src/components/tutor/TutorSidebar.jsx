import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, getCurrentUserApi } from "../../services/authService";

const menuItems = [
  { to: "/tutor/dashboard", label: "Tổng quan", icon: "dashboard" },
  { to: "/tutor/classes", label: "Các Môn dạy", icon: "menu_book" },
  { to: "/tutor/students", label: "Học viên", icon: "groups" },
  { to: "/tutor/schedule", label: "Lịch trình", icon: "calendar_month" },
  { to: "/tutor/finance", label: "Tài chính", icon: "account_balance_wallet" },
  { to: "/tutor/profile", label: "Hồ sơ cá nhân", icon: "account_circle" },
  { to: "/tutor/reviews", label: "Đánh giá", icon: "reviews" },
];

export default function TutorSidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const isVerified = Boolean(user?.isTutorVerified);

  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      try {
        const result = await getCurrentUserApi();
        const currentUser = result?.data;
        if (!mounted || !currentUser) return;

        localStorage.setItem("user", JSON.stringify(currentUser));
        setUser(currentUser);
      } catch {
        // Keep local fallback if API unavailable
      }
    };

    loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="tutor-sidebar">
      <div className="tutor-sidebar__brand">
        <div className="tutor-sidebar__logo">E</div>
        <div className="tutor-sidebar__title">EduMatch</div>
      </div>

      <nav className="tutor-sidebar__menu">
        {menuItems.map((item) => {
          const isLocked = !isVerified && item.to === "/tutor/classes";
          return isLocked ? (
            <div
              key={item.to}
              className="tutor-sidebar__link tutor-sidebar__link--disabled"
              title="Chức năng này đang chờ admin duyệt"
              onClick={() => navigate("/tutor/classes")}
              role="button"
              tabIndex={0}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `tutor-sidebar__link ${isActive ? "tutor-sidebar__link--active" : ""}`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="tutor-sidebar__footer">
        <div className="tutor-sidebar__role">
          <div className="tutor-sidebar__role-icon">T</div>
          <div>
            <div className="tutor-sidebar__role-caption">Đang là</div>
            <div className="tutor-sidebar__role-value">Gia sư</div>
            <div className="tutor-sidebar__role-caption">
              {isVerified ? "Đã được duyệt" : "Đang chờ admin duyệt"}
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="tutor-sidebar__logout">
          <span className="material-symbols-outlined">logout</span>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
