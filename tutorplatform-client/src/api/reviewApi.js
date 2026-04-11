// JavaScript source code
import axiosInstance from './axiosConfig';

export const reviewApi = {
    // Student tạo review
    createReview: async (data) => {
        const response = await axiosInstance.post('/reviews', data);
        return response.data;
    },

    // Xem tất cả reviews + summary của tutor (public)
    getTutorReviews: async (tutorId) => {
        const response = await axiosInstance.get(`/reviews/tutor/${tutorId}`);
        return response.data;
    },

    // Kiểm tra student đã review tutor này chưa
    getMyReviewForTutor: async (tutorId) => {
        const response = await axiosInstance.get(`/reviews/my-review/${tutorId}`);
        return response.data;
    },

    // Student xoá review
    deleteReview: async (reviewId) => {
        const response = await axiosInstance.delete(`/reviews/${reviewId}`);
        return response.data;
    },
};