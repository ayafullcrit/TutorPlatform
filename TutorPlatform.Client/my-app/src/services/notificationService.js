import api from "./api";

// GET /api/notifications?limit=20
export const getNotifications = async (limit = 20) => {
  const response = await api.get("/notifications", { params: { limit } });
  return response.data;
};

// PUT /api/notifications/{id}/read
export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

// PUT /api/notifications/read-all
export const markAllAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};

// DELETE /api/notifications/{id}
export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};
