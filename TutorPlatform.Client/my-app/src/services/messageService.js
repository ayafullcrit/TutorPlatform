import api from "./api";

// Get all messages
export const getMessages = async (params = {}) => {
  try {
    const response = await api.get("/messages", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Get message by ID
export const getMessageById = async (id) => {
  try {
    const response = await api.get(`/messages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching message ${id}:`, error);
    throw error;
  }
};

// Get conversation with user
export const getConversation = async (userId, params = {}) => {
  try {
    const response = await api.get(`/messages/conversation/${userId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching conversation with ${userId}:`, error);
    throw error;
  }
};

// Send message
export const sendMessage = async (messageData) => {
  try {
    const response = await api.post("/messages", messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Update message
export const updateMessage = async (id, messageData) => {
  try {
    const response = await api.put(`/messages/${id}`, messageData);
    return response.data;
  } catch (error) {
    console.error(`Error updating message ${id}:`, error);
    throw error;
  }
};

// Mark message as read
export const markMessageAsRead = async (id) => {
  try {
    const response = await api.put(`/messages/${id}/read`);
    return response.data;
  } catch (error) {
    console.error(`Error marking message ${id} as read:`, error);
    throw error;
  }
};

// Delete message
export const deleteMessage = async (id) => {
  try {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting message ${id}:`, error);
    throw error;
  }
};

// Get all conversations for current user
export const getAllConversations = async (params = {}) => {
  try {
    const response = await api.get("/messages/conversations", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};
