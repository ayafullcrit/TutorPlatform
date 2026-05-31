namespace TutorPlatform.API.Models.DTOs.Responses.Dashboard
{
    public class AdminDashboardStats
    {
        public int TotalTutors { get; set; }
        public int TotalStudents { get; set; }
        public int TotalClasses { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class TutorDashboardStats
    {
        public int ActiveClasses { get; set; }
        public int TotalStudents { get; set; }
        public decimal MonthlyEarnings { get; set; }
        public double AverageRating { get; set; }
    }

    public class StudentDashboardStats
    {
        public int TotalCourses { get; set; }
        public int TotalHours { get; set; }
        public double AverageRating { get; set; }
        public int AttendanceRate { get; set; }
    }

    public class TutorEarningsResponse
    {
        public string CurrentBalance { get; set; } = string.Empty;
        public string MonthlyIncome { get; set; } = string.Empty;
        public string PendingFee { get; set; } = string.Empty;
    }

    public class TutorEarningsChartItem
    {
        public string Month { get; set; } = string.Empty;
        public decimal Earnings { get; set; }
    }
}
