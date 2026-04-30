import api from "./api";

export const loginApi = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);
    if (response.data.success) {
      const { token, data } = response.data;
      // Store token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      return {
        token,
        user: data,
      };
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

export const logoutApi = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Optional: call backend logout if needed
  // return api.post("/auth/logout");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};