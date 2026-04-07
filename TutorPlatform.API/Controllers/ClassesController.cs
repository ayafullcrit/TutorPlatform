using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TutorPlatform.API.Models.DTOs.Requests.Class;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassController : ControllerBase
    {
        private readonly IClassService _classService;
        public ClassController(IClassService classService)
        {
            _classService = classService;
        }
        //create new clas
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateClass([FromBody] CreateClassRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(request);
            }

            var userId = GetCurrentUserId();
            var tutorUserId = await GetTutorUserIdAsync(userId);
            if (tutorUserId == null)
            {
                return BadRequest(new { message = "Chỉ gia sư mới có thể tạo lớp học" });
            }

            var result = await _classService.CreateClassAsync(tutorUserId.Value, request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return CreatedAtAction(
                nameof(GetClassById),
                new { id = result.Data.Id },
                result
            );
        }

        //my class - phải có TRƯỚC {id} để tránh routing conflict
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

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        //search class - phải có TRƯỚC {id}
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchClasses([FromQuery] SearchClassRequest request)
        {
            var result = await _classService.SearchClassAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        //get classes by subject - phải có TRƯỚC {id}
        [HttpGet("by-subject/{subjectId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetClassesBySubject(int subjectId)
        {
            var result = await _classService.GetClassesBySubjectAsync(subjectId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        //get class by id - phải có SAU các route khác
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetClassById(int id)
        {
            var result = await _classService.GetClassByIdAsync(id);
            if(!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
        //update class
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

            var result = await _classService.UpdateClassAsync(tutorUserId.Value, id, request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        //delete class
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

            var result = await _classService.DeleteClassAsync(tutorUserId.Value, id);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        //helper method
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }

        private async Task<int?> GetTutorUserIdAsync(int userId)
        {
            // Check if user has tutor profile
            var tutorClaim = User.FindFirst("TutorId");
            if (tutorClaim != null && int.TryParse(tutorClaim.Value, out int tutorId))
            {
                return userId;  // UserId = TutorUserId in our design
            }

            return null;
        }
    }
}
