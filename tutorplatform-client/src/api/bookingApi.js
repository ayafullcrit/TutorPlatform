import axiosInstance from './axiosConfig';

export const bookingApi = {

  createBooking: async (data) => {
    const response = await axiosInstance.post('/bookings', data);
    return response.data;
  },

  getMyBookingsAsStudent: async () => {
    const response = await axiosInstance.get('/bookings/my-bookings');
    return response.data;
  },

  cancelBookingByStudent: async (id) => {
    const response = await axiosInstance.delete(`/bookings/${id}/cancel`);
    return response.data;
  },

  getMyBookingsAsTutor: async () => {
    const response = await axiosInstance.get('/bookings/tutor-bookings');
    return response.data;
  },

  confirmBooking: async (id) => {
    const response = await axiosInstance.put(`/bookings/${id}/confirm`);
    return response.data;
  },

  completeBooking: async (id) => {
    const response = await axiosInstance.put(`/bookings/${id}/complete`);
    return response.data;
  },

  cancelBookingByTutor: async (id) => {
    const response = await axiosInstance.delete(`/bookings/${id}/tutor-cancel`);
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  },
};