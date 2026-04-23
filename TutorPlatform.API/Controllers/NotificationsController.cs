using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // GET /api/notifications?limit=20
        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] int limit = 20)
        {
            var result = await _notificationService
                .GetNotificationsAsync(GetCurrentUserId(), limit);
            return Ok(result);
        }

        // PUT /api/notifications/{id}/read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var result = await _notificationService
                .MarkAsReadAsync(GetCurrentUserId(), id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // PUT /api/notifications/read-all
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var result = await _notificationService
                .MarkAllAsReadAsync(GetCurrentUserId());
            return Ok(result);
        }

        // DELETE /api/notifications/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _notificationService
                .DeleteNotificationAsync(GetCurrentUserId(), id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(claim!.Value);
        }
    }
}