import api from "./api";

// Khớp với BookingController endpoints:
// POST   /api/bookings                  -> CreateBooking
// GET    /api/bookings/my-bookings      -> GetMyBookingsAsStudent
// DELETE /api/bookings/{id}/cancel      -> CancelBookingByStudent
// GET    /api/bookings/tutor-bookings   -> GetMyBookingsAsTutor
// PUT    /api/bookings/{id}/confirm     -> ConfirmBooking
// PUT    /api/bookings/{id}/complete    -> CompleteBooking
// DELETE /api/bookings/{id}/tutor-cancel -> CancelBookingByTutor
// GET    /api/bookings/{id}             -> GetBookingById

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

// Học sinh xem lịch đặt của mình
export const getStudentBookings = async () => {
  const response = await api.get("/bookings/my-bookings");
  return response.data;
};

// Gia sư xem lịch đặt của mình
export const getTutorBookings = async () => {
  const response = await api.get("/bookings/tutor-bookings");
  return response.data;
};

// Xem chi tiết booking
export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

// Học sinh hủy booking
export const cancelBookingByStudent = async (id) => {
  const response = await api.delete(`/bookings/${id}/cancel`);
  return response.data;
};

// Gia sư xác nhận booking
export const confirmBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/confirm`);
  return response.data;
};

// Gia sư đánh dấu hoàn thành
export const completeBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/complete`);
  return response.data;
};

// Gia sư hủy booking
export const cancelBookingByTutor = async (id) => {
  const response = await api.delete(`/bookings/${id}/tutor-cancel`);
  return response.data;
};