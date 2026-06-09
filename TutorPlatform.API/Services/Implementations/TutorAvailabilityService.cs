using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.Tutor;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Tutor;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Implementations
{
    public class TutorAvailabilityService : ITutorAvailabilityService
    {
        private readonly ApplicationDbContext _context;

        public TutorAvailabilityService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<TutorAvailabilityResponse>>> GetAvailabilityAsync(int tutorUserId)
        {
            try
            {
                var slots = await _context.TutorAvailabilities
                    .Where(a => a.TutorId == tutorUserId)
                    .OrderBy(a => a.DayOfWeek)
                    .ThenBy(a => a.StartTime)
                    .Select(a => new TutorAvailabilityResponse
                    {
                        Id = a.Id,
                        DayOfWeek = (int)a.DayOfWeek,
                        StartTime = a.StartTime.ToString(@"hh\:mm"),
                        EndTime = a.EndTime.ToString(@"hh\:mm")
                    })
                    .ToListAsync();

                return new ApiResponse<List<TutorAvailabilityResponse>>(slots, "Lấy lịch rảnh thành công");
            }
            catch (Exception ex)
            {
                return new ApiResponse<List<TutorAvailabilityResponse>>("Lỗi: " + ex.Message, new List<string> { ex.Message });
            }
        }

        public async Task<ApiResponse> SetAvailabilityAsync(int tutorUserId, SetAvailabilityRequest request)
        {
            try
            {
                // Xóa tất cả lịch rảnh cũ rồi thêm mới
                var existing = await _context.TutorAvailabilities
                    .Where(a => a.TutorId == tutorUserId)
                    .ToListAsync();

                _context.TutorAvailabilities.RemoveRange(existing);

                foreach (var slot in request.Slots)
                {
                    if (!TimeSpan.TryParse(slot.StartTime, out var start) ||
                        !TimeSpan.TryParse(slot.EndTime, out var end))
                        return new ApiResponse("Định dạng giờ không hợp lệ (HH:mm)", false);

                    if (end <= start)
                        return new ApiResponse("Giờ kết thúc phải sau giờ bắt đầu", false);

                    _context.TutorAvailabilities.Add(new TutorAvailability
                    {
                        TutorId = tutorUserId,
                        DayOfWeek = (DayOfWeek)slot.DayOfWeek,
                        StartTime = start,
                        EndTime = end
                    });
                }

                await _context.SaveChangesAsync();
                return new ApiResponse("Cập nhật lịch rảnh thành công", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse("Lỗi: " + ex.Message, false);
            }
        }

        public async Task<ApiResponse> DeleteSlotAsync(int tutorUserId, int slotId)
        {
            try
            {
                var slot = await _context.TutorAvailabilities.FindAsync(slotId);
                if (slot == null) return new ApiResponse("Không tìm thấy slot", false);
                if (slot.TutorId != tutorUserId) return new ApiResponse("Không có quyền xóa slot này", false);

                _context.TutorAvailabilities.Remove(slot);
                await _context.SaveChangesAsync();
                return new ApiResponse("Xóa slot thành công", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse("Lỗi: " + ex.Message, false);
            }
        }
    }
}
