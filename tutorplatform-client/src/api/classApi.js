import axiosInstance from './axiosConfig';

export const classApi = {
  // Create class (Tutor only)
  createClass: async (data) => {
    const response = await axiosInstance.post('/class', data);  // sửa: /class
    return response.data;
  },

  // Get class by ID
  getClassById: async (id) => {
    const response = await axiosInstance.get(`/class/${id}`);   // sửa: /class
    return response.data;
  },

  // Update class (Tutor only)
  updateClass: async (id, data) => {
    const response = await axiosInstance.put(`/class/${id}`, data); // sửa
    return response.data;
  },

  // Delete class (Tutor only)
  deleteClass: async (id) => {
    const response = await axiosInstance.delete(`/class/${id}`); // sửa
    return response.data;
  },

  // Search classes (with filters & pagination)
  searchClasses: async (params) => {
    const response = await axiosInstance.get('/class/search', { params }); // sửa: /class/search
    return response.data;
  },

  // Get my classes (Tutor)
  getMyClasses: async () => {
    const response = await axiosInstance.get('/class/my-classes'); // sửa
    return response.data;
  },

  // Get classes by subject
  getClassesBySubject: async (subjectId) => {
    const response = await axiosInstance.get(`/class/by-subject/${subjectId}`); // sửa
    return response.data;
  },
};