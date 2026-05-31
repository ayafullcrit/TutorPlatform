using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TutorPlatform.API.Models.DTOs.Requests.User;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        public readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }
        //GET api/users/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();
            var result = await _userService.GetProfileAsync(userId);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }
        //PUT api/users/profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = GetCurrentUserId();
            var result = await _userService.UpdateProfileAsync(userId, request);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        // PUT: api/users/student-profile
        [HttpPut("student-profile")]
        public async Task<IActionResult> UpdateStudentProfile([FromBody] UpdateStudentProfileRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var result = await _userService.UpdateStudentProfileAsync(userId, request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // PUT: api/users/tutor-profile
        [HttpPut("tutor-profile")]
        public async Task<IActionResult> UpdateTutorProfile([FromBody] UpdateTutorProfileRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var result = await _userService.UpdateTutorProfileAsync(userId, request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await _userService.GetAllUsersAsync();
            return Ok(result);
        }

        [HttpGet("admin/list")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminUsers([FromQuery] string? role = null, [FromQuery] bool? isActive = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            return Ok(await _userService.GetAdminUsersAsync(role, isActive, page, pageSize));
        }

        [HttpPut("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminUpdateUser(int id, [FromBody] AdminUpdateUserRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _userService.AdminUpdateUserAsync(id, request);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("admin/{id}/toggle-status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleStatus(int id, [FromBody] ToggleUserStatusRequest request)
        {
            var result = await _userService.ToggleUserStatusAsync(id, request.IsActive);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }
    }
}

