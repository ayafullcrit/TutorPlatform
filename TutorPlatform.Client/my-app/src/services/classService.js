import api from "./api";

export const getClasses = async (searchParams = {}) => {
  try {
    const response = await api.get("/class/search", { params: searchParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

export const getClassById = async (id) => {
  try {
    const response = await api.get(`/class/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching class ${id}:`, error);
    throw error;
  }
};

export const getMyClasses = async () => {
  try {
    const response = await api.get("/class/my-classes");
    return response.data;
  } catch (error) {
    console.error("Error fetching my classes:", error);
    throw error;
  }
};

export const createClass = async (classData) => {
  try {
    const response = await api.post("/class", classData);
    return response.data;
  } catch (error) {
    console.error("Error creating class:", error);
    throw error;
  }
};

export const updateClass = async (id, classData) => {
  try {
    const response = await api.put(`/class/${id}`, classData);
    return response.data;
  } catch (error) {
    console.error(`Error updating class ${id}:`, error);
    throw error;
  }
};

export const deleteClass = async (id) => {
  try {
    const response = await api.delete(`/class/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting class ${id}:`, error);
    throw error;
  }
};
