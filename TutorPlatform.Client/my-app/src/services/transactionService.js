import api from "./api";

/**
 * Lấy thông tin ví (số dư, tổng nạp, tổng chi, ...)
 */
export const getWallet = async () => {
  try {
    const response = await api.get("/payments/wallet");
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet:", error);
    throw error;
  }
};

/**
 * Lấy lịch sử giao dịch
 */
export const getTransactionHistory = async (page = 1, pageSize = 20) => {
  try {
    const response = await api.get("/payments/history", {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw error;
  }
};

/**
 * Nạp tiền vào ví (Mock)
 */
export const topUpBalance = async (amount, paymentMethod = "Mock") => {
  try {
    const response = await api.post("/payments/top-up", {
      amount,
      paymentMethod
    });
    return response.data;
  } catch (error) {
    console.error("Error topping up:", error);
    throw error;
  }
};

/**
 * Rút tiền từ ví
 */
export const withdrawBalance = async (amount) => {
  try {
    const response = await api.post("/payments/withdraw", {
      amount
    });
    return response.data;
  } catch (error) {
    console.error("Error withdrawing:", error);
    throw error;
  }
};

// --- Legacy support (if needed by other components) ---

export const getUserTransactions = async () => {
  const result = await getTransactionHistory();
  return result;
};

export const getPaymentHistory = async () => {
  const result = await getTransactionHistory();
  return result.success ? result.data : [];
};

/**
 * Lấy toàn bộ giao dịch hệ thống (dành cho Admin)
 */
export const getTransactions = async () => {
  try {
    const response = await api.get("/payments/admin/transactions");
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions for admin:", error);
    throw error;
  }
};

/**
 * Hoàn tiền giao dịch (Mock stub)
 */
export const refundPayment = async (transactionId) => {
  try {
    const response = await api.post(`/payments/refund/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error("Error refunding payment:", error);
    throw error;
  }
};