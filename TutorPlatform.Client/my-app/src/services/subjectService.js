import api from "./api";

export const getAllSubjects = async () => {
  try {
    const response = await api.get("/subject");
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const getSubjectById = async (id) => {
  try {
    const response = await api.get(`/subject/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subject ${id}:`, error);
    throw error;
  }
};

export const createSubject = async (subjectData) => {
  try {
    const response = await api.post("/subject", subjectData);
    return response.data;
  } catch (error) {
    console.error("Error creating subject:", error);
    throw error;
  }
};

export const updateSubject = async (id, subjectData) => {
  try {
    const response = await api.put(`/subject/${id}`, subjectData);
    return response.data;
  } catch (error) {
    console.error(`Error updating subject ${id}:`, error);
    throw error;
  }
};

export const deleteSubject = async (id) => {
  try {
    const response = await api.delete(`/subject/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting subject ${id}:`, error);
    throw error;
  }
};
