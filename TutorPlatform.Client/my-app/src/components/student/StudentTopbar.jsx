import { useEffect, useState } from "react";
import { getCurrentUser, getCurrentUserApi } from "../../services/authService";

const defaultProfile = {
  fullName: "Hoc vien",
  avatar: "",
  badge: "HOC VIEN",
};

const getInitials = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[parts.length - 2][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "HV";
};

export default function StudentTopbar() {
  const [profile, setProfile] = useState(defaultProfile);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const localUser = getCurrentUser();
    if (localUser) {
      setProfile((prev) => ({
        ...prev,
        fullName: localUser.fullName || prev.fullName,
        avatar: localUser.avatar || prev.avatar,
      }));
    }

    const loadProfile = async () => {
      try {
        const result = await getCurrentUserApi();
        const user = result?.data;
        if (!user) return;

        localStorage.setItem("user", JSON.stringify(user));
        setProfile((prev) => ({
          ...prev,
          fullName: user.fullName || prev.fullName,
          avatar: user.avatar || prev.avatar,
        }));
      } catch (error) {
        console.warn("Using local topbar profile:", error?.message);
      }
    };

    loadProfile();
  }, []);

  return (
    <header className="student-topbar">
      <div className="student-topbar__left">
        <h2 className="student-topbar__title">Welcome to EduMatch</h2>
      </div>

      <div className="student-topbar__right">
        <button className="student-topbar__icon-btn">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <div className="student-topbar__profile">
          {profile.avatar && !avatarError ? (
            <img
              src={profile.avatar}
              alt="Student avatar"
              loading="lazy"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="student-topbar__avatar-fallback">
              {getInitials(profile.fullName)}
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
