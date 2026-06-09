using TutorPlatform.API.Models.DTOs.Requests.Tutor;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Tutor;

namespace TutorPlatform.API.Services.Interfaces
{
    public interface ITutorAvailabilityService
    {
        Task<ApiResponse<List<TutorAvailabilityResponse>>> GetAvailabilityAsync(int tutorUserId);
        Task<ApiResponse> SetAvailabilityAsync(int tutorUserId, SetAvailabilityRequest request);
        Task<ApiResponse> DeleteSlotAsync(int tutorUserId, int slotId);
    }
}
