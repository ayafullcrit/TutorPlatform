import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard", label: "Tổng quan", icon: "dashboard" },
  { to: "/admin/accounts", label: "Tài khoản", icon: "group" },
  { to: "/admin/verifications", label: "Xác minh", icon: "verified_user" },
  { to: "/admin/transactions", label: "Giao dịch", icon: "account_balance_wallet" },
  { to: "/admin/system-config", label: "Cấu hình hệ thống", icon: "settings_suggest" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex w-72 min-h-screen flex-col bg-[#f5f5dc] shrink-0">
      <div className="p-8 border-b border-stone-200/30">
        <h1 className="text-3xl italic text-[#7b5800] font-serif">The Editorial</h1>
        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-stone-500">
          Quản trị viên
        </p>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-l-md transition-colors ${
                isActive
                  ? "bg-[#fbfbe2] text-[#7b5800] font-bold border-r-4 border-[#7b5800]"
                  : "text-stone-600 hover:bg-[#fbfbe2]"
              }`
            }
          >
            <span className="material-symbols-outlined shrink-0">
              {item.icon}
            </span>
            <span className="text-[15px] leading-6">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto space-y-2 border-t border-stone-200/30">
        <button
          type="button"
          className="w-full flex items-center gap-4 px-5 py-3 text-stone-600 hover:bg-[#fbfbe2] rounded-md"
        >
          <span className="material-symbols-outlined shrink-0">help</span>
          <span>Hỗ trợ</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-3 text-stone-600 hover:bg-[#fbfbe2] rounded-md"
        >
          <span className="material-symbols-outlined shrink-0">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
