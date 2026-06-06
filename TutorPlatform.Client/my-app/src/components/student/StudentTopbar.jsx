import { useEffect, useState } from "react";
import { getCurrentUser, getCurrentUserApi } from "../../services/authService";
import { getAvatarSrc, getInitials, getUserFullName } from "../../utils/avatar";
import NotificationDropdown from "../shared/NotificationDropdown";
import "../../styles/notification.css";

const defaultProfile = {
  fullName: "Hoc vien",
  avatarSrc: "",
  badge: "HOC VIEN",
};

export default function StudentTopbar() {
  const [profile, setProfile] = useState(defaultProfile);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const applyUser = (user) => {
      if (!user) return;
      setAvatarError(false);
      setProfile((prev) => ({
        ...prev,
        fullName: getUserFullName(user, prev.fullName),
        avatarSrc: getAvatarSrc(user),
      }));
    };

    const localUser = getCurrentUser();
    applyUser(localUser);

    const loadProfile = async () => {
      try {
        const result = await getCurrentUserApi();
        const user = result?.data;
        if (!user) return;

        localStorage.setItem("user", JSON.stringify(user));
        applyUser(user);
      } catch (error) {
        console.warn("Using local topbar profile:", error?.message);
      }
    };

    const handleUserUpdated = () => applyUser(getCurrentUser());

    loadProfile();
    window.addEventListener("user:updated", handleUserUpdated);

    return () => window.removeEventListener("user:updated", handleUserUpdated);
  }, []);

  return (
    <header className="student-topbar">
      <div className="student-topbar__left">
        <h2 className="student-topbar__title">Welcome to EduMatch</h2>
      </div>

      <div className="student-topbar__right">
        <NotificationDropdown />

        <div className="student-topbar__profile">
          {profile.avatarSrc && !avatarError ? (
            <img
              src={profile.avatarSrc}
              alt="Student avatar"
              loading="lazy"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="student-topbar__avatar-fallback">
              {getInitials(profile.fullName, "HV")}
            </div>
          )}
          <div>
            <div className="student-topbar__name">{profile.fullName}</div>
            <div className="student-topbar__role">{profile.badge}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
