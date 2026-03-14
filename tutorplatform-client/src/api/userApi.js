import axiosInstance from './axiosConfig';

export const userApi = {
  // Get profile
  getProfile: async () => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  },

  // Update general profile
  updateProfile: async (data) => {
    const response = await axiosInstance.put('/users/profile', data);
    return response.data;
  },

  // Update student profile
  updateStudentProfile: async (data) => {
    const response = await axiosInstance.put('/users/student-profile', data);
    return response.data;
  },

  // Update tutor profile
  updateTutorProfile: async (data) => {
    const response = await axiosInstance.put('/users/tutor-profile', data);
    return response.data;
  },
};