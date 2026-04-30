import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/tutor/dashboard", label: "Tổng quan", icon: "dashboard" },
  { to: "/tutor/subjects", label: "Môn học", icon: "subject" },
  { to: "/tutor/classes", label: "Lớp học", icon: "menu_book" },
  { to: "/tutor/students", label: "Học viên", icon: "groups" },
  { to: "/tutor/schedule", label: "Lịch trình", icon: "calendar_month" },
  { to: "/tutor/finance", label: "Tài chính", icon: "account_balance_wallet" },
  { to: "/tutor/profile", label: "Hồ sơ cá nhân", icon: "account_circle" },
  
];

export default function TutorSidebar() {
  return (
    <div className="tutor-sidebar">
      <div className="tutor-sidebar__brand">
        <div className="tutor-sidebar__logo">E</div>
        <div className="tutor-sidebar__title">EduMatch</div>
      </div>

      <nav className="tutor-sidebar__menu">
        {menuItems.map((item) => (
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
        ))}
      </nav>

      <div className="tutor-sidebar__footer">
        <div className="tutor-sidebar__role">
          <div className="tutor-sidebar__role-icon">T</div>
          <div>
            <div className="tutor-sidebar__role-caption">Đang là</div>
            <div className="tutor-sidebar__role-value">Gia sư</div>
          </div>
        </div>

        <button className="tutor-sidebar__logout">
          <span className="material-symbols-outlined">logout</span>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}