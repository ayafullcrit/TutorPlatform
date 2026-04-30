import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/student/dashboard", label: "Tổng quan", icon: "dashboard" },
  { to: "/student/find-tutor", label: "Tìm gia sư", icon: "search" },
  { to: "/student/schedule", label: "Lịch trình", icon: "calendar_month" },
  { to: "/student/profile", label: "Hồ sơ cá nhân", icon: "person" },
];

export default function StudentSidebar() {
  return (
    <div className="student-sidebar">
      <div className="student-sidebar__brand">
        <div className="student-sidebar__logo">E</div>
        <div className="student-sidebar__brand-text">EduMatch</div>
      </div>

      <nav className="student-sidebar__menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `student-sidebar__link ${
                isActive ? "student-sidebar__link--active" : ""
              }`
            }
          >
            <span className="material-symbols-outlined student-sidebar__icon">
              {item.icon}
            </span>
            <span className="student-sidebar__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="student-sidebar__footer">
        <div className="student-sidebar__role">
          <span className="material-symbols-outlined student-sidebar__icon">
            badge
          </span>
          <div>
            <div className="student-sidebar__role-caption">Đang là</div>
            <div className="student-sidebar__role-value">Học viên</div>
          </div>
        </div>

        <button className="student-sidebar__logout">
          <span className="material-symbols-outlined student-sidebar__icon">
            logout
          </span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}