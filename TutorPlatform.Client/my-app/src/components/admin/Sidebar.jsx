import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/accounts", label: "Accounts", icon: "group" },
  { to: "/admin/verifications", label: "Verifications", icon: "verified_user" },
  { to: "/admin/transactions", label: "Transactions", icon: "account_balance_wallet" },
  { to: "/admin/system-config", label: "System config", icon: "settings_suggest" },
  { to: "/admin/classes", label: "Class Management", icon: "school" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-72 min-h-screen flex-col bg-[#f5f5dc] shrink-0">
      <div className="p-8 border-b border-stone-200/30">
        <h1 className="text-3xl italic text-[#7b5800] font-serif">The Editorial</h1>
        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-stone-500">
          Archivist Admin
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
        <button className="w-full flex items-center gap-4 px-5 py-3 text-stone-600 hover:bg-[#fbfbe2] rounded-md">
          <span className="material-symbols-outlined shrink-0">help</span>
          <span>Support</span>
        </button>

        <button className="w-full flex items-center gap-4 px-5 py-3 text-stone-600 hover:bg-[#fbfbe2] rounded-md">
          <span className="material-symbols-outlined shrink-0">logout</span>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}