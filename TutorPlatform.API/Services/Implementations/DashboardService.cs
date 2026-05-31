using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Dashboard;
using TutorPlatform.API.Models.Enums;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<AdminDashboardStats>> GetAdminStatsAsync()
        {
            try
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

                return new ApiResponse<AdminDashboardStats>(stats, "Lấy thông tin dashboard admin thành công");
            }
            catch (Exception ex)
            {
                return new ApiResponse<AdminDashboardStats>("Lỗi: " + ex.Message, new List<string> { ex.Message });
            }
        }

        public async Task<ApiResponse<TutorDashboardStats>> GetTutorStatsAsync(int userId)
        {
            try
            {
                var activeClasses = await _context.Classes
                    .Where(c => c.TutorId == userId && c.Status == ClassStatus.Active)
                    .CountAsync();

                var totalStudents = await _context.Bookings
                    .Where(b => b.TutorId == userId && (b.Status == BookingStatus.Confirmed || b.Status == BookingStatus.Completed))
                    .Select(b => b.StudentId)
                    .Distinct()
                    .CountAsync();

                var now = DateTime.UtcNow;
                var monthlyEarnings = await _context.Payments
                    .Where(p => p.Booking.TutorId == userId && 
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

                return new ApiResponse<TutorDashboardStats>(stats, "Lấy thông tin dashboard gia sư thành công");
            }
            catch (Exception ex)
            {
                return new ApiResponse<TutorDashboardStats>("Lỗi: " + ex.Message, new List<string> { ex.Message });
            }
        }

        public async Task<ApiResponse<TutorEarningsResponse>> GetTutorEarningsAsync(int userId)
        {
            try
            {
                var totalBalance = await _context.Payments
                    .Where(p => p.Booking.TutorId == userId && p.Status == PaymentStatus.Successful)
                    .SumAsync(p => p.Amount);

                var now = DateTime.UtcNow;
                var monthlyIncome = await _context.Payments
                    .Where(p => p.Booking.TutorId == userId && 
                                p.Status == PaymentStatus.Successful && 
                                p.PaymentDate.Month == now.Month && 
                                p.PaymentDate.Year == now.Year)
                    .SumAsync(p => p.Amount);

                var pendingFee = await _context.Payments
                    .Where(p => p.Booking.TutorId == userId && p.Status == PaymentStatus.Pending)
                    .SumAsync(p => p.Amount);

                var earnings = new TutorEarningsResponse
                {
                    CurrentBalance = $"₫{totalBalance.ToString("N0")}",
                    MonthlyIncome = $"₫{monthlyIncome.ToString("N0")}",
                    PendingFee = $"₫{pendingFee.ToString("N0")}"
                };

                return new ApiResponse<TutorEarningsResponse>(earnings, "Lấy thông tin thu nhập gia sư thành công");
            }
            catch (Exception ex)
            {
                return new ApiResponse<TutorEarningsResponse>("Lỗi: " + ex.Message, new List<string> { ex.Message });
            }
        }

        public async Task<ApiResponse<StudentDashboardStats>> GetStudentStatsAsync(int userId)
        {
            try
            {
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

                return new ApiResponse<StudentDashboardStats>(stats, "Lấy thông tin dashboard học viên thành công");
            }
            catch (Exception ex)
            {
                return new ApiResponse<StudentDashboardStats>("Lỗi: " + ex.Message, new List<string> { ex.Message });
            }
        }

        public async Task<ApiResponse<List<TutorEarningsChartItem>>> GetTutorEarningsChartAsync(int userId, int months)
        {
            try
            {
                var now = DateTime.UtcNow;
                var startDate = new DateTime(now.Year, now.Month, 1).AddMonths(-(months - 1));

                var payments = await _context.Payments
                    .Where(p => p.Booking.TutorId == userId &&
                                p.Status == PaymentStatus.Successful &&
                                p.PaymentDate >= startDate)
                    .Select(p => new { p.PaymentDate, p.Amount })
                    .ToListAsync();

                var result = Enumerable.Range(0, months)
                    .Select(i =>
                    {
                        var date = startDate.AddMonths(i);
                        var total = payments
                            .Where(p => p.PaymentDate.Year == date.Year && p.PaymentDate.Month == date.Month)
                            .Sum(p => p.Amount);
                        return new TutorEarningsChartItem
                        {
                            Month = $"T{date.Month}/{date.Year % 100}",
                            Earnings = total
                        };
                    })
                    .ToList();

                return new ApiResponse<List<TutorEarningsChartItem>>(result, "Lấy biểu đồ thu nhập thành công");
            }
            catch (Exception ex)
            {
                return new ApiResponse<List<TutorEarningsChartItem>>("Lỗi: " + ex.Message, new List<string> { ex.Message });
            }
        }

        public async Task<ApiResponse<AdminDashboardStats>> GetPublicStatsAsync()
        {
            try
            {
                var stats = new AdminDashboardStats
                {
                    TotalTutors = await _context.Tutors.CountAsync(),
                    TotalStudents = await _context.Students.CountAsync(),
                    TotalClasses = await _context.Classes.CountAsync(),
                    TotalRevenue = 0
                };

                return new ApiResponse<AdminDashboardStats>(stats, "Lấy thông tin public stats thành công");
            }
            catch (Exception ex)
            {
                return new ApiResponse<AdminDashboardStats>("Lỗi: " + ex.Message, new List<string> { ex.Message });
            }
        }
    }
}
