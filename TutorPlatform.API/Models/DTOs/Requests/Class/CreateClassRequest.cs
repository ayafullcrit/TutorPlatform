using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Class
{
    public class CreateClassRequest
    {
        [Required(ErrorMessage = "Môn học là bắt buộc")]
        public int SubjectId { get; set; }

        [Required(ErrorMessage = "Tiêu đề là bắt buộc")]
        [StringLength(200,ErrorMessage = "Tiêu đề không được dài quá 200 ký tự")]
        public string Title { get; set; }

        [StringLength(2000, ErrorMessage = "Mô tả không được dài quá 2000 ký tự")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Khối lóp học là bắt buộc")]
        [Range(1,12,ErrorMessage = "Khối lớp học từ 1 đến 12")]
        public int GradeLevel { get; set; }
        public string ThumbnailUrl { get; set; }

        [Required(ErrorMessage = "Giá mỗi buổi học phải là bắt buộc")]
        [Range(0, 10000000, ErrorMessage = "Giá phải từ 0 đến 10,000,000")]
        public decimal PricePerSession {  get; set; }

        [Required(ErrorMessage = "Thời lượng buổi học là bắt buộc")]
        public int DurationMinutes {  get; set; }

        [Range(1,100, ErrorMessage = "Số buộc học từ 1 - 100")]
        public int TotalSessions {  get; set; }

        [Range(1, 50, ErrorMessage = "Số học viên từ 1 - 50")]
        public int MaxStudents{  get; set; }
    }
}