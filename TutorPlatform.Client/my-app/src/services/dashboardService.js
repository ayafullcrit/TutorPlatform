import api from "./api";

// Get admin dashboard stats
export const getAdminStats = async () => {
  try {
    const response = await api.get("/dashboard/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};

// Get admin recent transactions
export const getAdminRecentTransactions = async (params = {}) => {
  try {
    const response = await api.get("/dashboard/admin/recent-transactions", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin recent transactions:", error);
    throw error;
  }
};

// Get student dashboard stats
export const getStudentStats = async (studentId) => {
  try {
    const response = await api.get(`/dashboard/student/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student stats:", error);
    throw error;
  }
};

// Get tutor dashboard stats
export const getTutorStats = async (tutorId) => {
  try {
    const response = await api.get(`/dashboard/tutor/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tutor stats:", error);
    throw error;
  }
};

// Get tutor earnings
export const getTutorEarnings = async (tutorId, params = {}) => {
  try {
    const response = await api.get(`/dashboard/tutor/earnings`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching tutor earnings:", error);
    throw error;
  }
};

// Get tutor recent bookings
export const getTutorRecentBookings = async (tutorId, params = {}) => {
  try {
    const response = await api.get(`/dashboard/tutor/recent-bookings`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching tutor recent bookings:", error);
    throw error;
  }
};

// Get chart data for dashboards
export const getChartData = async (role, params = {}) => {
  try {
    const response = await api.get(`/dashboard/charts/data`, { params: { role, ...params } });
    return response.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
};

// Get admin dashboard data (legacy)
export const getAdminDashboardData = async () => {
  try {
    const response = await api.get("/dashboard/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};