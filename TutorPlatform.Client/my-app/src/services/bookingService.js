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

// ==================== ENROLLMENTS (NEW) ====================
export const enrollClass = async (data) => {
  const response = await api.post("/enrollments", data);
  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await api.get("/enrollments/my");
  return response.data;
};

export const leaveClass = async (id) => {
  const response = await api.delete(`/enrollments/${id}/leave`);
  return response.data;
};

export const scheduleSession = async (data) => {
  const response = await api.post("/enrollments/schedule-session", data);
  return response.data;
};

export const getAvailableSlots = async (classId, weekStart) => {
  let url = `/enrollments/available-slots/${classId}`;
  if (weekStart) url += `?weekStart=${weekStart}`;
  const response = await api.get(url);
  return response.data;
};

// ==================== TUTOR ENROLLMENTS (NEW) ====================
export const getTutorEnrollments = async () => {
  const response = await api.get("/enrollments/tutor");
  return response.data;
};

export const approveEnrollment = async (id) => {
  const response = await api.put(`/enrollments/tutor/${id}/approve`);
  return response.data;
};

export const rejectEnrollment = async (id) => {
  const response = await api.put(`/enrollments/tutor/${id}/reject`);
  return response.data;
};

export const removeStudent = async (id) => {
  const response = await api.delete(`/enrollments/tutor/${id}/remove`);
  return response.data;
};