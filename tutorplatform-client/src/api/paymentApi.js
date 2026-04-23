import axiosInstance from './axiosConfig';

export const paymentApi = {
  // Nạp tiền vào ví
  topUp: async (data) => {
    const response = await axiosInstance.post('/payments/top-up', data);
    return response.data;
  },

  // Xem số dư + giao dịch gần đây
  getWallet: async () => {
    const response = await axiosInstance.get('/payments/wallet');
    return response.data;
  },

  // Lịch sử toàn bộ (phân trang)
  getHistory: async (page = 1, pageSize = 20) => {
    const response = await axiosInstance.get('/payments/history', {
      params: { page, pageSize }
    });
    return response.data;
  },
};