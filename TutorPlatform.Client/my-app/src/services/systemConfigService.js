import api from "./api";

export const getSystemConfig = async () => {
  const response = await api.get("/system-config");
  return response.data;
};

export const updateSystemConfig = async (payload) => {
  const response = await api.put("/system-config", payload);
  return response.data;
};
