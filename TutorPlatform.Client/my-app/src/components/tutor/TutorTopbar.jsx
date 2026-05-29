import { useEffect, useState } from "react";
import { getCurrentUser, getCurrentUserApi } from "../../services/authService";

const mockTutorProfile = {
  fullName: "Tran Minh Thang",
  avatar: "",
  badge: "GIA SU KIM CUONG",
};

const getInitials = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[parts.length - 2][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "GS";
};

export default function TutorTopbar() {
  const [profile, setProfile] = useState(mockTutorProfile);
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
        // Fallback mock data when API is unavailable
        console.warn("Using mock topbar profile:", error?.message);
      }
    };

    loadProfile();
  }, []);

  return (
    <header className="tutor-topbar">
      <div className="tutor-topbar__search">
        <span className="material-symbols-outlined">search</span>
        <input placeholder="Tim kiem lop hoc, hoc vien, hoa don..." />
      </div>

      <div className="tutor-topbar__actions">
        <button className="tutor-topbar__icon-btn">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <div className="tutor-topbar__profile">
          {profile.avatar && !avatarError ? (
            <img
              src={profile.avatar}
              alt="Tutor avatar"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="tutor-topbar__avatar-fallback">
              {getInitials(profile.fullName)}
            </div>
          )}
          <div>
            <div className="tutor-topbar__name">{profile.fullName}</div>
            <div className="tutor-topbar__role">{profile.badge}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
