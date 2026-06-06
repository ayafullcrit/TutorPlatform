import { useEffect, useState } from "react";
import { getCurrentUser, getCurrentUserApi } from "../../services/authService";
import { getAvatarSrc, getInitials, getUserFullName } from "../../utils/avatar";
import NotificationDropdown from "../shared/NotificationDropdown";
import "../../styles/notification.css";

const mockTutorProfile = {
  fullName: "Tran Minh Thang",
  avatarSrc: "",
  badge: "GIA SU KIM CUONG",
};

export default function TutorTopbar() {
  const [profile, setProfile] = useState(mockTutorProfile);
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
        // Fallback mock data when API is unavailable
        console.warn("Using mock topbar profile:", error?.message);
      }
    };

    const handleUserUpdated = () => applyUser(getCurrentUser());

    loadProfile();
    window.addEventListener("user:updated", handleUserUpdated);

    return () => window.removeEventListener("user:updated", handleUserUpdated);
  }, []);

  return (
    <header className="tutor-topbar">
      <div className="tutor-topbar__search">
        <span className="material-symbols-outlined">search</span>
        <input placeholder="Tim kiem lop hoc, hoc vien, hoa don..." />
      </div>

      <div className="tutor-topbar__actions">
        <NotificationDropdown />

        <div className="tutor-topbar__profile">
          {profile.avatarSrc && !avatarError ? (
            <img
              src={profile.avatarSrc}
              alt="Tutor avatar"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="tutor-topbar__avatar-fallback">
              {getInitials(profile.fullName, "GS")}
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
