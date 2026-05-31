import { useMemo } from "react";

export default function Topbar() {
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date()),
    []
  );

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <div>
          <p className="admin-topbar__eyebrow">Bảng điều khiển quản trị</p>
          <h2 className="admin-topbar__title">Xin chào, admin</h2>
        </div>
        <span className="admin-topbar__date">{today}</span>
      </div>

      <div className="admin-topbar__actions">
        <button className="admin-topbar__chip">
          <span className="material-symbols-outlined">notifications</span>
          <span>Thông báo</span>
        </button>
        <button className="admin-topbar__chip">
          <span className="material-symbols-outlined">history</span>
          <span>Lịch sử</span>
        </button>
        <button className="admin-topbar__primary">
          <span className="material-symbols-outlined">add</span>
          <span>Tạo nhanh</span>
        </button>
      </div>
    </header>
  );
}
