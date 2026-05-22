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
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        // ============================================
        // STUDENT: POST /api/bookings
        // ============================================
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetCurrentUserId();
            var result = await _bookingService.CreateBookingAsync(userId, request);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        // ============================================
        // STUDENT: GET /api/bookings/my-bookings
        // ============================================
        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookingsAsStudent()
        {
            var userId = GetCurrentUserId();
            var result = await _bookingService.GetMyBookingsAsStudentAsync(userId);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        // ============================================
        // STUDENT: DELETE /api/bookings/{id}/cancel
        // ============================================
        [HttpDelete("{id}/cancel")]
        public async Task<IActionResult> CancelBookingByStudent(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _bookingService.CancelBookingByStudentAsync(userId, id);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        // ============================================
        // TUTOR: GET /api/bookings/tutor-bookings
        // ============================================
        [HttpGet("tutor-bookings")]
        public async Task<IActionResult> GetMyBookingsAsTutor()
        {
            var userId = GetCurrentUserId();
            var result = await _bookingService.GetMyBookingsAsTutorAsync(userId);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        // ============================================
        // TUTOR: PUT /api/bookings/{id}/confirm
        // ============================================
        [HttpPut("{id}/confirm")]
        public async Task<IActionResult> ConfirmBooking(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _bookingService.ConfirmBookingAsync(userId, id);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        // ============================================
        // TUTOR: PUT /api/bookings/{id}/complete
        // ============================================
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteBooking(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _bookingService.CompleteBookingAsync(userId, id);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        // ============================================
        // TUTOR: DELETE /api/bookings/{id}/tutor-cancel
        // ============================================
        [HttpDelete("{id}/tutor-cancel")]
        public async Task<IActionResult> CancelBookingByTutor(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _bookingService.CancelBookingByTutorAsync(userId, id);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        // ============================================
        // SHARED: GET /api/bookings/{id}
        // ============================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _bookingService.GetBookingByIdAsync(id, userId);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim!.Value);
        }
    }
}