using TutorPlatform.API.Models.DTOs.Requests.Auth;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Auth;


namespace TutorPlatform.API.Services.Interfaces
{

    public interface IAuthService
    {
        Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
        Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
        Task<ApiResponse> ChangePasswordAsync(int userId, ChangePasswordRequest request);
        Task<ApiResponse<UserInfo>> GetCurrentUserAsync(int userId);
    }
}