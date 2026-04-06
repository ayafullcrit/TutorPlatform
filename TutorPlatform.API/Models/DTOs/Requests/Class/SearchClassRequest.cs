using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Class
{
    public class SearchClassRequest
    {
        public string? Keyword { get; set; }

        public int? SubjectId { get; set; }

        public int? Grade { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public int? TutorId { get; set; }

        // Pagination
        public int Page { get; set; } = 1;

        [Range(1, 100, ErrorMessage = "PageSize phải từ 1 đến 100")]
        public int PageSize { get; set; } = 20;

        // Sorting
        public string SortBy { get; set; } = "Price";  // Price

        public string SortOrder { get; set; } = "desc";  // asc, desc
    }
}