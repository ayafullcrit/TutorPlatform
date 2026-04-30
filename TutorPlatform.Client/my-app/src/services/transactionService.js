import api from "./api";

// Get all transactions
export const getTransactions = async (params = {}) => {
  try {
    const response = await api.get("/payments", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Get transaction by ID
export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};

// Get user transactions
export const getUserTransactions = async (userId, params = {}) => {
  try {
    const response = await api.get(`/payments/user/${userId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching transactions for user ${userId}:`, error);
    throw error;
  }
};

// Create payment/transaction
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post("/payments", paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

// Update payment/transaction
export const updatePayment = async (id, paymentData) => {
  try {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating payment ${id}:`, error);
    throw error;
  }
};

// Refund payment
export const refundPayment = async (id) => {
  try {
    const response = await api.post(`/payments/${id}/refund`);
    return response.data;
  } catch (error) {
    console.error(`Error refunding payment ${id}:`, error);
    throw error;
  }
};

// Check payment status
export const checkPaymentStatus = async (id) => {
  try {
    const response = await api.post("/payments/check-status", { paymentId: id });
    return response.data;
  } catch (error) {
    console.error(`Error checking payment status for ${id}:`, error);
    throw error;
  }
};

// Get payment history (legacy)
export const getPaymentHistory = async () => {
  try {
    const response = await api.get("/payments/history");
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }
};