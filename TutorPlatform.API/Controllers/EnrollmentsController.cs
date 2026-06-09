using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TutorPlatform.API.Models.DTOs.Requests.Booking;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EnrollmentsController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentsController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        // POST /api/enrollments  – Học viên đăng ký lớp
        [HttpPost]
        public async Task<IActionResult> Enroll([FromBody] EnrollClassRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userId = GetCurrentUserId();
            var result = await _enrollmentService.EnrollAsync(userId, request);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // GET /api/enrollments/my  – Lấy danh sách lớp đang theo học
        [HttpGet("my")]
        public async Task<IActionResult> GetMyEnrollments()
        {
            var userId = GetCurrentUserId();
            var result = await _enrollmentService.GetMyEnrollmentsAsync(userId);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // DELETE /api/enrollments/{id}/leave  – Xin nghỉ (xóa ngay, hoàn tiền)
        [HttpDelete("{id}/leave")]
        public async Task<IActionResult> LeaveClass(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _enrollmentService.LeaveClassAsync(userId, id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // POST /api/enrollments/schedule-session  – Đặt buổi học cụ thể
        [HttpPost("schedule-session")]
        public async Task<IActionResult> ScheduleSession([FromBody] ScheduleSessionRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userId = GetCurrentUserId();
            var result = await _enrollmentService.ScheduleSessionAsync(userId, request);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // GET /api/enrollments/available-slots/{classId}?weekStart=YYYY-MM-DD
        [HttpGet("available-slots/{classId}")]
        public async Task<IActionResult> GetAvailableSlots(int classId, [FromQuery] DateTime? weekStart)
        {
            // Mặc định tuần hiện tại (thứ 2)
            var start = weekStart?.Date ?? GetCurrentWeekMonday();
            var result = await _enrollmentService.GetAvailableSlotsAsync(classId, start);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // GET /api/enrollments/tutor  – Gia sư lấy danh sách học viên
        [HttpGet("tutor")]
        public async Task<IActionResult> GetTutorEnrollments()
        {
            var userId = GetCurrentUserId();
            var result = await _enrollmentService.GetTutorEnrollmentsAsync(userId);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // PUT /api/enrollments/tutor/{id}/approve  – Gia sư duyệt
        [HttpPut("tutor/{id}/approve")]
        public async Task<IActionResult> ApproveEnrollment(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _enrollmentService.ApproveEnrollmentAsync(userId, id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // PUT /api/enrollments/tutor/{id}/reject  – Gia sư từ chối
        [HttpPut("tutor/{id}/reject")]
        public async Task<IActionResult> RejectEnrollment(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _enrollmentService.RejectEnrollmentAsync(userId, id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // DELETE /api/enrollments/tutor/{id}/remove  – Gia sư xóa học viên khỏi lớp
        [HttpDelete("tutor/{id}/remove")]
        public async Task<IActionResult> RemoveStudent(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _enrollmentService.RemoveStudentAsync(userId, id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(claim!.Value);
        }

        private static DateTime GetCurrentWeekMonday()
        {
            var today = DateTime.UtcNow.Date;
            int diff = (7 + (int)today.DayOfWeek - (int)DayOfWeek.Monday) % 7;
            return today.AddDays(-diff);
        }
    }
}
