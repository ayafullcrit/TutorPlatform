using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Subject;
namespace TutorPlatform.API.Services.Interfaces
{
    public interface ISubjectService
    {
        Task<ApiResponse<List<SubjectResponse>>> GetAllSubjectAsync();
        Task<ApiResponse<SubjectResponse>> GetSubjectByIdAsync(int id);
    }
}