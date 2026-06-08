import { useEffect, useRef, useState, useCallback } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../services/notificationService";

const TYPE_ICON = {
  Booking: "📅",
  Payment: "💳",
  Review: "⭐",
  System: "🔔",
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ unreadCount: 0, notifications: [] });
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Tải danh sách thông báo
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications(30);
      if (res?.data) setData(res.data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Tải lần đầu và polling 30 giây/lần
  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  // Đóng khi click ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    setOpen((v) => !v);
    if (!open) load();
  };

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setData((prev) => ({
      ...prev,
      unreadCount: Math.max(0, prev.unreadCount - 1),
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    setData((prev) => ({
      ...prev,
      unreadCount: 0,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteNotification(id);
    setData((prev) => ({
      ...prev,
      unreadCount: prev.notifications.find((n) => n.id === id && !n.isRead)
        ? prev.unreadCount - 1
        : prev.unreadCount,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  };

  return (
    <div className="notif-wrap" ref={ref}>
      {/* Bell button */}
      <button className="notif-bell" onClick={handleOpen} aria-label="Thông báo">
        <span className="material-symbols-outlined">notifications</span>
        {data.unreadCount > 0 && (
          <span className="notif-badge">
            {data.unreadCount > 99 ? "99+" : data.unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="notif-panel">
          {/* Header */}
          <div className="notif-panel__header">
            <span className="notif-panel__title">
              Thông báo
              {data.unreadCount > 0 && (
                <em className="notif-panel__count">{data.unreadCount} chưa đọc</em>
              )}
            </span>
            {data.unreadCount > 0 && (
              <button className="notif-panel__readall" onClick={handleMarkAll}>
                Đọc tất cả
              </button>
            )}
          </div>

          {/* Body */}
          <div className="notif-panel__body">
            {loading && data.notifications.length === 0 ? (
              <div className="notif-empty">Đang tải...</div>
            ) : data.notifications.length === 0 ? (
              <div className="notif-empty">
                <span style={{ fontSize: 36 }}>🔔</span>
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              data.notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${n.isRead ? "notif-item--read" : "notif-item--unread"}`}
                  onClick={() => !n.isRead && handleMarkRead(n.id)}
                >
                  <div className="notif-item__icon">
                    {TYPE_ICON[n.type] || "📩"}
                  </div>
                  <div className="notif-item__content">
                    <div className="notif-item__title">{n.title}</div>
                    <div className="notif-item__msg">{n.message}</div>
                    <div className="notif-item__time">{n.timeAgo}</div>
                  </div>
                  <button
                    className="notif-item__del"
                    onClick={(e) => handleDelete(e, n.id)}
                    title="Xoá"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
