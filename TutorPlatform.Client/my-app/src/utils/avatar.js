import { API_BASE_URL } from "../services/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const getUserAvatar = (user) =>
  user?.avatarUrl ?? user?.AvatarUrl ?? user?.avatar ?? user?.Avatar ?? "";

export const applyUserAvatar = (user, avatarUrl) => {
  const nextAvatar = avatarUrl ?? getUserAvatar(user) ?? "";
  return {
    ...(user || {}),
    avatarUrl: nextAvatar,
    AvatarUrl: nextAvatar,
    avatar: nextAvatar,
    Avatar: nextAvatar,
  };
};

export const getUserFullName = (user, fallback = "") =>
  user?.fullName ?? user?.FullName ?? fallback;

export const getAvatarSrc = (user) => {
  const avatar = getUserAvatar(user)?.trim();
  if (!avatar) return "";
  if (/^(https?:)?\/\//i.test(avatar) || avatar.startsWith("data:")) return avatar;
  return `${API_ORIGIN}${avatar.startsWith("/") ? "" : "/"}${avatar}`;
};

export const getInitials = (fullName = "", fallback = "U") => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[parts.length - 2][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return fallback;
};
