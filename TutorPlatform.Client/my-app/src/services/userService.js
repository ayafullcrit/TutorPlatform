import api from "./api";

export const getProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export const updateStudentProfile = async (studentData) => {
  try {
    const response = await api.put("/users/student-profile", studentData);
    return response.data;
  } catch (error) {
    console.error("Error updating student profile:", error);
    throw error;
  }
};

export const updateTutorProfile = async (tutorData) => {
  try {
    const response = await api.put("/users/tutor-profile", tutorData);
    return response.data;
  } catch (error) {
    console.error("Error updating tutor profile:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getAdminUsers = async (params = {}) => {
  try {
    const response = await api.get("/users/admin/list", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin users:", error);
    throw error;
  }
};

export const updateAdminUser = async (id, payload) => {
  const response = await api.put(`/users/admin/${id}`, payload);
  return response.data;
};

export const toggleUserStatus = async (id, isActive) => {
  const response = await api.put(`/users/admin/${id}/toggle-status`, { isActive });
  return response.data;
};
