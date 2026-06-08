import api from "./api";
import { applyUserAvatar } from "../utils/avatar";

// Backend trả về: { success, message, data: { token, expiresAt, user: { id, role (int), ... } } }
// UserRole enum: Student=1, Tutor=2, Admin=3

export const loginApi = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);

    if (response.data.success) {
      const { token, user } = response.data.data; // data.data = AuthResponse
      const normalizedUser = applyUserAvatar(user, user?.avatarUrl ?? user?.AvatarUrl ?? user?.avatar ?? user?.Avatar ?? "");
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      return { token, user: normalizedUser };
    }

    throw new Error(response.data.message || "Đăng nhập thất bại");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerApi = async (registerData) => {
  try {
    const response = await api.post("/auth/register", registerData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const getCurrentUserApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutApi = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Helper: lấy role text từ số
// Backend UserRole enum: Student=1, Tutor=2, Admin=3
export const getRoleText = (role) => {
  switch (role) {
    case 1: return "student";
    case 2: return "tutor";
    case 3: return "admin";
    default: return null;
  }
};

export const isAdmin = (user) => user?.role === 3;
export const isTutor = (user) => user?.role === 2;
export const isStudent = (user) => user?.role === 1;
