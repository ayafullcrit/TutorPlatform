using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.Tutor;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.Enums;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TutorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public TutorsController(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [HttpGet("pending-verification")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PendingVerification()
        {
            var tutors = await _context.Tutors
                .Include(t => t.User)
                .Where(t => t.VerificationStatus == VerificationStatus.Pending)
                .Select(t => new
                {
                    t.UserId,
                    FullName = t.User.FullName,
                    Email = t.User.Email,
                    PhoneNumber = t.User.PhoneNumber,
                    Address = t.User.Address,
                    Balance = t.User.Balance,
                    AvatarUrl = t.User.AvatarUrl,
                    t.HourlyRate,
                    t.Rating,
                    t.TotalReviews,
                    t.IsVerified,
                    VerificationStatus = (int)t.VerificationStatus,
                    t.VerificationNote,
                    Role = t.User.Role,
                    IsActive = t.User.IsActive
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>(tutors, "Lấy danh sách chờ duyệt thành công"));
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchTutors(
            [FromQuery] string? keyword = null,
            [FromQuery] string? address = null,
            [FromQuery] int? subjectId = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _context.Tutors
                .Include(t => t.User)
                .Include(t => t.Classes)
                .ThenInclude(c => c.Subject)
                .Where(t => t.VerificationStatus == VerificationStatus.Approved && t.User.IsActive)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var lowerKeyword = keyword.Trim().ToLower();
                query = query.Where(t =>
                    t.User.FullName.ToLower().Contains(lowerKeyword) ||
                    t.User.Address.ToLower().Contains(lowerKeyword));
            }

            if (!string.IsNullOrWhiteSpace(address))
            {
                query = query.Where(t => t.User.Address == address);
            }

            if (subjectId.HasValue)
            {
                query = query.Where(t => t.Classes.Any(c => c.SubjectId == subjectId.Value));
            }

            var total = await query.CountAsync();

            var tutors = await query
                .OrderByDescending(t => t.Rating)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new
                {
                    tutorUserId = t.UserId,
                    tutorName = t.User.FullName,
                    tutorAvatar = t.User.AvatarUrl,
                    email = t.User.Email,
                    phoneNumber = t.User.PhoneNumber,
                    address = t.User.Address,
                    rating = t.Rating,
                    totalReviews = t.TotalReviews,
                    hourlyRate = t.HourlyRate,
                    isVerified = t.IsVerified,
                    verificationStatus = (int)t.VerificationStatus,
                    subjects = t.Classes.Select(c => c.Subject.Name).Distinct().ToList(),
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>(new
            {
                total,
                page,
                pageSize,
                items = tutors
            }, "Lấy danh sách gia sư thành công"));
        }

        [HttpPut("{id}/verify")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> VerifyTutor(int id, [FromBody] VerifyTutorRequest request)
        {
            var tutor = await _context.Tutors.Include(t => t.User).FirstOrDefaultAsync(t => t.UserId == id);
            if (tutor == null) return NotFound(new ApiResponse("Tutor không tồn tại", false));

            tutor.VerificationStatus = request.Status;
            tutor.IsVerified = request.Status == VerificationStatus.Approved;
            tutor.VerificationNote = request.Note;
            await _context.SaveChangesAsync();

            await _notificationService.CreateAsync(
                id,
                request.Status == VerificationStatus.Approved ? "Gia sư được duyệt" : "Gia sư bị từ chối",
                request.Status == VerificationStatus.Approved
                    ? "Hồ sơ của bạn đã được admin phê duyệt."
                    : $"Hồ sơ bị từ chối. {request.Note}",
                "System",
                id.ToString());

            return Ok(new ApiResponse<object>(new
            {
                tutor.UserId,
                tutor.VerificationStatus,
                tutor.IsVerified
            }, "Cập nhật xác minh gia sư thành công"));
        }
    }
}
