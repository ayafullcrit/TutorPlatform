using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Dashboard;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("admin/stats")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminStats()
        {
            var stats = new AdminDashboardStats
            {
                TotalTutors = await _context.Tutors.CountAsync(),
                TotalStudents = await _context.Students.CountAsync(),
                TotalClasses = await _context.Classes.CountAsync(),
                TotalRevenue = await _context.Payments
                    .Where(p => p.Status == PaymentStatus.Successful)
                    .SumAsync(p => p.Amount)
            };

            return Ok(new ApiResponse<AdminDashboardStats>(stats));
        }

        [HttpGet("tutor/stats")]
        [Authorize(Roles = "Tutor")]
        public async Task<IActionResult> GetTutorStats()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            
            // Lấy stats từ database
            var activeClasses = await _context.Classes
                .Where(c => c.TutorId == userId && c.Status == ClassStatus.Active)
                .CountAsync();

            var totalStudents = await _context.Bookings
                .Where(b => b.Class.TutorId == userId && (b.Status == BookingStatus.Confirmed || b.Status == BookingStatus.Completed))
                .Select(b => b.StudentId)
                .Distinct()
                .CountAsync();

            var now = DateTime.UtcNow;
            var monthlyEarnings = await _context.Payments
                .Where(p => p.Booking.Class.TutorId == userId && 
                            p.Status == PaymentStatus.Successful && 
                            p.PaymentDate.Month == now.Month && 
                            p.PaymentDate.Year == now.Year)
                .SumAsync(p => p.Amount);

            var avgRating = await _context.Reviews
                .Where(r => r.TutorId == userId)
                .Select(r => (double?)r.Rating)
                .AverageAsync() ?? 0;

            var stats = new TutorDashboardStats
            {
                ActiveClasses = activeClasses,
                TotalStudents = totalStudents,
                MonthlyEarnings = monthlyEarnings,
                AverageRating = Math.Round(avgRating, 1)
            };

            return Ok(new ApiResponse<TutorDashboardStats>(stats));
        }

        [HttpGet("tutor/earnings")]
        [Authorize(Roles = "Tutor")]
        public async Task<IActionResult> GetTutorEarnings()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            
            var totalBalance = await _context.Payments
                .Where(p => p.Booking.Class.TutorId == userId && p.Status == PaymentStatus.Successful)
                .SumAsync(p => p.Amount);

            var now = DateTime.UtcNow;
            var monthlyIncome = await _context.Payments
                .Where(p => p.Booking.Class.TutorId == userId && 
                            p.Status == PaymentStatus.Successful && 
                            p.PaymentDate.Month == now.Month && 
                            p.PaymentDate.Year == now.Year)
                .SumAsync(p => p.Amount);

            var pendingFee = await _context.Payments
                .Where(p => p.Booking.Class.TutorId == userId && p.Status == PaymentStatus.Pending)
                .SumAsync(p => p.Amount);

            var earnings = new
            {
                currentBalance = $"₫{totalBalance.ToString("N0")}",
                monthlyIncome = $"₫{monthlyIncome.ToString("N0")}",
                pendingFee = $"₫{pendingFee.ToString("N0")}"
            };

            return Ok(new ApiResponse<object>(earnings));
        }

        [HttpGet("student/stats")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetStudentStats()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var totalCourses = await _context.Bookings
                .Where(b => b.StudentId == userId)
                .Select(b => b.ClassId)
                .Distinct()
                .CountAsync();

            var completedBookings = await _context.Bookings
                .Where(b => b.StudentId == userId && b.Status == BookingStatus.Completed)
                .CountAsync();

            var totalBookings = await _context.Bookings
                .Where(b => b.StudentId == userId)
                .CountAsync();

            var stats = new StudentDashboardStats
            {
                TotalCourses = totalCourses,
                TotalHours = (int)(completedBookings * 1.5), // Giả sử 1.5h/buổi
                AverageRating = 0,
                AttendanceRate = totalBookings > 0 ? (int)((double)completedBookings / totalBookings * 100) : 0
            };

            return Ok(new ApiResponse<StudentDashboardStats>(stats));
        }

        [HttpGet("public/stats")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicStats()
        {
            var stats = new AdminDashboardStats
            {
                TotalTutors = await _context.Tutors.CountAsync(),
                TotalStudents = await _context.Students.CountAsync(),
                TotalClasses = await _context.Classes.CountAsync(),
                TotalRevenue = 0
            };

            return Ok(new ApiResponse<AdminDashboardStats>(stats));
        }
    }
}
