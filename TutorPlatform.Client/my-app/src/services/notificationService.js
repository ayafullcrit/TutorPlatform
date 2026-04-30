import api from "./api";

// Get all notifications
export const getNotifications = async (params = {}) => {
  try {
    const response = await api.get("/notifications", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Get notification by ID
export const getNotificationById = async (id) => {
  try {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notification ${id}:`, error);
    throw error;
  }
};

// Get user notifications
export const getUserNotifications = async (userId, params = {}) => {
  try {
    const response = await api.get(`/notifications/user/${userId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error);
    throw error;
  }
};

// Create notification
export const createNotification = async (notificationData) => {
  try {
    const response = await api.post("/notifications", notificationData);
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Update notification
export const updateNotification = async (id, notificationData) => {
  try {
    const response = await api.put(`/notifications/${id}`, notificationData);
    return response.data;
  } catch (error) {
    console.error(`Error updating notification ${id}:`, error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (id) => {
  try {
    const response = await api.put(`/notifications/${id}/mark-read`);
    return response.data;
  } catch (error) {
    console.error(`Error marking notification ${id} as read:`, error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (id) => {
  try {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting notification ${id}:`, error);
    throw error;
  }
};

// Clear all notifications for user
export const clearAllNotifications = async (userId) => {
  try {
    const response = await api.delete(`/notifications/user/${userId}/clear-all`);
    return response.data;
  } catch (error) {
    console.error(`Error clearing notifications for user ${userId}:`, error);
    throw error;
  }
};
