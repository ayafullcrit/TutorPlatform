import { useEffect, useMemo, useState } from "react";
import { getCurrentUser, getCurrentUserApi } from "../../services/authService";
import { getAvatarSrc, getInitials, getUserFullName } from "../../utils/avatar";

export default function Topbar() {
  const [user, setUser] = useState(getCurrentUser());
  const [avatarError, setAvatarError] = useState(false);
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

  useEffect(() => {
    const applyUser = (nextUser) => {
      setAvatarError(false);
      setUser(nextUser);
    };

    const loadProfile = async () => {
      try {
        const result = await getCurrentUserApi();
        const currentUser = result?.data;
        if (!currentUser) return;

        localStorage.setItem("user", JSON.stringify(currentUser));
        applyUser(currentUser);
      } catch {
        applyUser(getCurrentUser());
      }
    };

    const handleUserUpdated = () => applyUser(getCurrentUser());

    loadProfile();
    window.addEventListener("user:updated", handleUserUpdated);

    return () => window.removeEventListener("user:updated", handleUserUpdated);
  }, []);

  const fullName = getUserFullName(user, "Admin");
  const avatarSrc = getAvatarSrc(user);

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <div>
          <p className="admin-topbar__eyebrow">Bảng điều khiển quản trị</p>
          <h2 className="admin-topbar__title">Xin chào, admin</h2>
        </div>
        <span className="admin-topbar__date">{today}</span>
      </div>

      <div className="admin-topbar__profile">
        {avatarSrc && !avatarError ? (
          <img src={avatarSrc} alt="Admin avatar" onError={() => setAvatarError(true)} />
        ) : (
          <div className="admin-topbar__avatar-fallback">{getInitials(fullName, "AD")}</div>
        )}
        <div>
          <div className="admin-topbar__name">{fullName}</div>
          <div className="admin-topbar__role">ADMIN</div>
        </div>
      </div>
    </header>
  );
}
