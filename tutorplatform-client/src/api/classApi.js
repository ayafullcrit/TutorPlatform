import axiosInstance from './axiosConfig';

export const classApi = {
  // Create class (Tutor only)
  createClass: async (data) => {
    const response = await axiosInstance.post('/Class', data);
    return response.data;
  },

  // Get class by ID
  getClassById: async (id) => {
    const response = await axiosInstance.get(`/Class/${id}`);
    return response.data;
  },

  // Update class (Tutor only)
  updateClass: async (id, data) => {
    const response = await axiosInstance.put(`/Class/${id}`, data);
    return response.data;
  },

  // Delete class (Tutor only)
  deleteClass: async (id) => {
    const response = await axiosInstance.delete(`/Class/${id}`);
    return response.data;
  },

  // Search classes (with filters & pagination)
  searchClasses: async (params) => {
    const response = await axiosInstance.get('/Class/search', { params });
    return response.data;
  },

  // Get my classes (Tutor)
  getMyClasses: async () => {
    const response = await axiosInstance.get('/Class/my-classes');
    return response.data;
  },

  // Get classes by subject
  getClassesBySubject: async (subjectId) => {
    const response = await axiosInstance.get(`/Class/by-subject/${subjectId}`);
    return response.data;
  },
};