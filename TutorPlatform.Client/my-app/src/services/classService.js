import api from "./api";

// ClassController route: api/[controller] = api/classes
// POST   /api/classes                       -> CreateClass          (Authorize)
// GET    /api/classes/my-classes            -> GetMyClasses         (Authorize)
// GET    /api/classes/search                -> SearchClasses        (AllowAnonymous)
// GET    /api/classes/by-subject/{id}       -> GetClassesBySubject  (AllowAnonymous)
// GET    /api/classes/{id}                  -> GetClassById         (AllowAnonymous)
// PUT    /api/classes/{id}                  -> UpdateClass          (Authorize)
// DELETE /api/classes/{id}                  -> DeleteClass          (Authorize)

// SearchClassRequest fields:
// keyword, subjectId, grade, minPrice, maxPrice, tutorId
// page (default 1), pageSize (default 20), sortBy (default "Price"), sortOrder (default "desc")

export const searchClasses = async (params = {}) => {
  const response = await api.get("/classes/search", { params });
  // Returns ApiResponse<PaginatedResponse<ClassResponse>>
  return response.data;
};

export const getClassById = async (id) => {
  const response = await api.get(`/classes/${id}`);
  return response.data;
};

// Lấy lớp học của gia sư đang đăng nhập
export const getMyClasses = async () => {
  const response = await api.get("/classes/my-classes");
  return response.data;
};

// Lấy lớp học theo môn học
export const getClassesBySubject = async (subjectId) => {
  const response = await api.get(`/classes/by-subject/${subjectId}`);
  return response.data;
};

// Tạo lớp học mới (chỉ gia sư)
// CreateClassRequest: subjectId, title, description, gradeLevel, thumbnailUrl,
//                     pricePerSession, durationMinutes, sessionsPerWeek, maxStudents
export const createClass = async (classData) => {
  const response = await api.post("/classes", classData);
  return response.data;
};

// Cập nhật lớp học (chỉ gia sư sở hữu)
// UpdateClassRequest: subjectId, title, description, durationMinutes, thumbnailUrl,
//                     pricePerSession, sessionsPerWeek, maxStudents, status
export const updateClass = async (id, classData) => {
  const response = await api.put(`/classes/${id}`, classData);
  return response.data;
};

// Xóa lớp học (chỉ gia sư sở hữu)
export const deleteClass = async (id) => {
  const response = await api.delete(`/classes/${id}`);
  return response.data;
};
