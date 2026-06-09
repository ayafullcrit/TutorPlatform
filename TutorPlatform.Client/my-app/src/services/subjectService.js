import api from "./api";

// SubjectController route: api/[controller] = api/subjects
// GET /api/subjects       -> GetAllSubjects  (AllowAnonymous)
// GET /api/subjects/{id}  -> GetSubjectById  (AllowAnonymous)
// PUT /api/subjects/{id}  -> UpdateSubject   (Tutor, Admin)

export const getAllSubjects = async () => {
  const response = await api.get("/subjects");
  return response.data;
};

export const getSubjectById = async (id) => {
  const response = await api.get(`/subjects/${id}`);
  return response.data;
};

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
