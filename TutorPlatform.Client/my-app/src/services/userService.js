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
