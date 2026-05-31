using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.Class;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IClassService _classService;

        public ClassesController(ApplicationDbContext context, IClassService classService)
        {
            _context = context;
            _classService = classService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateClass([FromBody] CreateClassRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var tutorUserId = await GetTutorUserIdAsync(userId);
            if (tutorUserId == null)
            {
                return BadRequest(new { message = "Chỉ gia sư mới có thể tạo lớp học" });
            }

            if (!await IsTutorApprovedAsync(tutorUserId.Value))
            {
                return Forbid();
            }

            var result = await _classService.CreateClassAsync(tutorUserId.Value, request);
            return result.Success ? CreatedAtAction(nameof(GetClassById), new { id = result.Data.Id }, result) : BadRequest(result);
        }

        [HttpGet("my-classes")]
        [Authorize]
        public async Task<IActionResult> GetMyClasses()
        {
            var userId = GetCurrentUserId();
            var tutorUserId = await GetTutorUserIdAsync(userId);

            if (tutorUserId == null)
            {
                return BadRequest(new { message = "Chỉ gia sư mới có lớp học" });
            }

            var result = await _classService.GetMyClassesAsync(tutorUserId.Value);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchClasses([FromQuery] SearchClassRequest request)
        {
            var result = await _classService.SearchClassAsync(request);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("by-subject/{subjectId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetClassesBySubject(int subjectId)
        {
            var result = await _classService.GetClassesBySubjectAsync(subjectId);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetClassById(int id)
        {
            var result = await _classService.GetClassByIdAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateClass(int id, [FromBody] UpdateClassRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var tutorUserId = await GetTutorUserIdAsync(userId);

            if (tutorUserId == null)
            {
                return BadRequest(new { message = "Chỉ gia sư mới có thể cập nhật lớp học" });
            }

            if (!await IsTutorApprovedAsync(tutorUserId.Value))
            {
                return Forbid();
            }

            var result = await _classService.UpdateClassAsync(tutorUserId.Value, id, request);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteClass(int id)
        {
            var userId = GetCurrentUserId();
            var tutorUserId = await GetTutorUserIdAsync(userId);

            if (tutorUserId == null)
            {
                return BadRequest(new { message = "Chỉ gia sư mới có thể xóa lớp học" });
            }

            if (!await IsTutorApprovedAsync(tutorUserId.Value))
            {
                return Forbid();
            }

            var result = await _classService.DeleteClassAsync(tutorUserId.Value, id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim!.Value);
        }

        private async Task<int?> GetTutorUserIdAsync(int userId)
        {
            var tutorClaim = User.FindFirst("TutorId");
            if (tutorClaim != null && int.TryParse(tutorClaim.Value, out _))
            {
                return userId;
            }

            return null;
        }

        private async Task<bool> IsTutorApprovedAsync(int tutorUserId)
        {
            return await _context.Tutors.AnyAsync(t =>
                t.UserId == tutorUserId &&
                t.IsVerified &&
                t.VerificationStatus == TutorPlatform.API.Models.Enums.VerificationStatus.Approved &&
                t.User.IsActive);
        }
    }
}
