using TutorPlatform.API.Models.DTOs.Requests;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Requests.User;
using TutorPlatform.API.Models.DTOs.Responses.User;
namespace TutorPlatform.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse<UpdateProfileResponse>> GetProfileAsync(int UserId);
        Task<ApiResponse<UpdateProfileResponse>> UpdateProfileAsync(int UserId, UpdateProfileRequest request);
        Task<ApiResponse<UpdateProfileResponse>> UpdateStudentProfileAsync(int UserId, UpdateStudentProfileRequest request);
        Task<ApiResponse<UpdateProfileResponse>> UpdateTutorProfileAsync(int UserId, UpdateTutorProfileRequest request);
    }
}