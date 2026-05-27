import api from "./api";

// STUDENT:
// GET  /api/bookings/my-tutors
// POST /api/bookings/{id}/request-cancel   body: { reason }

export const getMyTutors = async () => {
  const response = await api.get("/bookings/my-tutors");
  return response.data;
};

export const requestRemoveTutor = async (bookingId, reason) => {
  const response = await api.post(`/bookings/${bookingId}/request-cancel`, {
    reason,
  });
  return response.data;
};

