import api from "./api";

// Get all tutors with filters
export const getTutors = async (filters = {}) => {
  try {
    const response = await api.get("/tutors", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching tutors:", error);
    throw error;
  }
};

// Get tutor by ID
export const getTutorById = async (id) => {
  try {
    const response = await api.get(`/tutors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tutor ${id}:`, error);
    throw error;
  }
};

// Search tutors with filters (subject, rating, etc)
export const searchTutors = async (searchParams = {}) => {
  try {
    const response = await api.get("/tutors/search", { params: searchParams });
    return response.data;
  } catch (error) {
    console.error("Error searching tutors:", error);
    throw error;
  }
};

// Get tutor rating
export const getTutorRating = async (tutorId) => {
  try {
    const response = await api.get(`/tutors/${tutorId}/rating`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tutor rating for ${tutorId}:`, error);
    throw error;
  }
};

// Get tutor reviews
export const getTutorReviews = async (tutorId, params = {}) => {
  try {
    const response = await api.get(`/tutors/${tutorId}/reviews`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching tutor reviews for ${tutorId}:`, error);
    throw error;
  }
};

// Get tutor classes
export const getTutorClasses = async (tutorId) => {
  try {
    const response = await api.get(`/tutors/${tutorId}/classes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tutor classes for ${tutorId}:`, error);
    throw error;
  }
};

// Update tutor profile
export const updateTutor = async (id, tutorData) => {
  try {
    const response = await api.put(`/tutors/${id}`, tutorData);
    return response.data;
  } catch (error) {
    console.error(`Error updating tutor ${id}:`, error);
    throw error;
  }
};

// Verify tutor (admin only)
export const verifyTutor = async (id) => {
  try {
    const response = await api.put(`/tutors/${id}/verify`);
    return response.data;
  } catch (error) {
    console.error(`Error verifying tutor ${id}:`, error);
    throw error;
  }
};

// Get pending tutors (admin)
export const getPendingTutors = async (params = {}) => {
  try {
    const response = await api.get("/tutors/pending", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching pending tutors:", error);
    throw error;
  }
};
