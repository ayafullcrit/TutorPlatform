using TutorPlatform.API.Models.DTOs.Requests.Class;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Class;
namespace TutorPlatform.API.Services.Interfaces
{
    public interface IClassService
    {
        //CRUD
        Task<ApiResponse<ClassResponse>> CreateClassAsync(int tutorUserId, CreateClassRequest request);
        Task<ApiResponse<ClassResponse>> GetClassByIdAsync(int id);
        Task<ApiResponse<ClassResponse>> UpdateClassAsync(int tutorUserId, int classId, UpdateClassRequest request);
        Task<ApiResponse> DeleteClassAsync(int tutorUserId, int classId);
        //List and search
        Task<ApiResponse<PaginatedResponse<ClassResponse>>> SearchClassAsync(SearchClassRequest request);
        Task<ApiResponse<List<ClassResponse>>> GetMyClassesAsync(int tutorUserId);
        Task<ApiResponse<List<ClassResponse>>> GetClassesBySubjectAsync(int subjectId);
    }
}