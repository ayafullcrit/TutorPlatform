import api from "./api";

// Get all bookings
export const getBookings = async (params = {}) => {
  try {
    const response = await api.get("/bookings", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw error;
  }
};

// Get student bookings
export const getStudentBookings = async (studentId, params = {}) => {
  try {
    const response = await api.get(`/bookings/student/${studentId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching student bookings for ${studentId}:`, error);
    throw error;
  }
};

// Get tutor bookings
export const getTutorBookings = async (tutorId, params = {}) => {
  try {
    const response = await api.get(`/bookings/tutor/${tutorId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching tutor bookings for ${tutorId}:`, error);
    throw error;
  }
};

// Create booking
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// Update booking
export const updateBooking = async (id, bookingData) => {
  try {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
    throw error;
  }
};

// Confirm booking
export const confirmBooking = async (id) => {
  try {
    const response = await api.put(`/bookings/${id}/confirm`);
    return response.data;
  } catch (error) {
    console.error(`Error confirming booking ${id}:`, error);
    throw error;
  }
};

// Cancel booking
export const cancelBooking = async (id) => {
  try {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Error cancelling booking ${id}:`, error);
    throw error;
  }
};

// Delete booking
export const deleteBooking = async (id) => {
  try {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting booking ${id}:`, error);
    throw error;
  }
};
