using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Responses;

namespace TutorPlatform.API.Controllers
{
    [ApiController]
    [Route("api/system-config")]
    [Authorize(Roles = "Admin")]
    public class SystemConfigController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SystemConfigController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var config = await _context.PlatformSettings.FirstOrDefaultAsync();
            return Ok(new ApiResponse<object>(new
            {
                platformFeeRate = config?.PlatformFeeRate ?? 0.10m,
                updatedAt = config?.UpdatedAt
            }));
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdatePlatformFeeRequest request)
        {
            var config = await _context.PlatformSettings.FirstOrDefaultAsync();
            if (config == null)
            {
                config = new Models.Entities.PlatformSetting { Id = 1 };
                _context.PlatformSettings.Add(config);
            }
            config.PlatformFeeRate = request.PlatformFeeRate;
            config.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(new ApiResponse<object>(new { config.PlatformFeeRate, config.UpdatedAt }, "Cập nhật phí nền tảng thành công"));
        }
    }

    public class UpdatePlatformFeeRequest
    {
        public decimal PlatformFeeRate { get; set; }
    }
}
