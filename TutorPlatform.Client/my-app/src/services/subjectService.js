import api from "./api";

// SubjectController route: api/[controller] = api/subjects
// GET /api/subjects       -> GetAllSubjects  (AllowAnonymous)
// GET /api/subjects/{id}  -> GetSubjectById  (AllowAnonymous)

export const getAllSubjects = async () => {
  const response = await api.get("/subjects");
  // Backend trả về ApiResponse<List<SubjectResponse>>
  // { success, message, data: [ { id, name, description, isActive, totalClasses } ] }
  return response.data;
};

export const getSubjectById = async (id) => {
  const response = await api.get(`/subjects/${id}`);
  return response.data;
};

// Các hàm dưới đây không có endpoint backend tương ứng (SubjectController chỉ có GET)
// Giữ lại nhưng sẽ báo lỗi 404 nếu gọi - cần backend implement thêm nếu muốn dùng

export const createSubject = async (subjectData) => {
  const response = await api.post("/subjects", subjectData);
  return response.data;
};

export const updateSubject = async (id, subjectData) => {
  const response = await api.put(`/subjects/${id}`, subjectData);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await api.delete(`/subjects/${id}`);
  return response.data;
};