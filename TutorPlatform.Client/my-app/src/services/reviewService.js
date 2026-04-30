import api from "./api";

// Get all reviews
export const getReviews = async (params = {}) => {
  try {
    const response = await api.get("/reviews", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// Get review by ID
export const getReviewById = async (id) => {
  try {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching review ${id}:`, error);
    throw error;
  }
};

// Get tutor reviews
export const getTutorReviews = async (tutorId, params = {}) => {
  try {
    const response = await api.get(`/reviews/tutor/${tutorId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for tutor ${tutorId}:`, error);
    throw error;
  }
};

// Get average rating for tutor
export const getTutorAverageRating = async (tutorId) => {
  try {
    const response = await api.get(`/reviews/average/${tutorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching average rating for tutor ${tutorId}:`, error);
    throw error;
  }
};

// Create review
export const createReview = async (reviewData) => {
  try {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// Update review
export const updateReview = async (id, reviewData) => {
  try {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  } catch (error) {
    console.error(`Error updating review ${id}:`, error);
    throw error;
  }
};

// Delete review
export const deleteReview = async (id) => {
  try {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting review ${id}:`, error);
    throw error;
  }
};
