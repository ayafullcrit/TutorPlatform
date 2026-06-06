using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TutorPlatform.API.Models.DTOs.Requests.User;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private const long MaxAvatarSizeBytes = 5 * 1024 * 1024;
        private static readonly HashSet<string> AllowedAvatarExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".webp"
        };

        public readonly IUserService _userService;
        private readonly IWebHostEnvironment _environment;

        public UsersController(IUserService userService, IWebHostEnvironment environment)
        {
            _userService = userService;
            _environment = environment;
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

        // POST api/users/avatar
        [HttpPost("avatar")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(MaxAvatarSizeBytes)]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new ApiResponse("File ảnh không hợp lệ", new List<string> { "Vui lòng chọn một file ảnh" }));
            }

            if (file.Length > MaxAvatarSizeBytes)
            {
                return BadRequest(new ApiResponse("File ảnh quá lớn", new List<string> { "Ảnh đại diện không được vượt quá 5MB" }));
            }

            if (string.IsNullOrWhiteSpace(file.ContentType) || !file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new ApiResponse("Định dạng file không hợp lệ", new List<string> { "Chỉ hỗ trợ file ảnh" }));
            }

            var extension = Path.GetExtension(file.FileName);
            if (!AllowedAvatarExtensions.Contains(extension))
            {
                return BadRequest(new ApiResponse("Định dạng ảnh không được hỗ trợ", new List<string> { "Chỉ hỗ trợ JPG, PNG, GIF hoặc WEBP" }));
            }

            var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var avatarDirectory = Path.Combine(webRoot, "images", "avatars");
            Directory.CreateDirectory(avatarDirectory);

            var userId = GetCurrentUserId();
            var fileName = $"user-{userId}-{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
            var filePath = Path.Combine(avatarDirectory, fileName);

            await using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            var avatarUrl = $"/images/avatars/{fileName}";
            return Ok(new ApiResponse<object>(new { avatarUrl }, "Tải ảnh đại diện thành công"));
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

