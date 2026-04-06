import axiosInstance from './axiosConfig';

export const subjectApi = {
  // Get all subjects
  getAllSubjects: async () => {
    const response = await axiosInstance.get('/subjects');
    return response.data;
  },

  // Get subject by ID
  getSubjectById: async (id) => {
    const response = await axiosInstance.get(`/subjects/${id}`);
    return response.data;
  },
};