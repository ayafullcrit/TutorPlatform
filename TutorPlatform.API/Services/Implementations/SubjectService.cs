using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Class;
using TutorPlatform.API.Models.DTOs.Responses.Subject;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Implementations
{
    public class SubjectService : ISubjectService
    {
        private readonly ApplicationDbContext _context;
        public SubjectService(ApplicationDbContext context)
        {
            if (_context == null)
            {
                _context = context;
            }
        }
        public async Task<ApiResponse<List<SubjectResponse>>> GetAllSubjectAsync()
        {
            try
            {
                var subjects = await _context.Subjects.Select(s => new SubjectResponse
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    //Icon = s.Icon,
                    IsActive = s.IsActive,
                    TotalClasses = s.Classes.Count(c => c.Status == Models.Enums.ClassStatus.Active)
                }).ToListAsync();

                return new ApiResponse<List<SubjectResponse>>(
                    subjects,
                    "Lấy môn học thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<List<SubjectResponse>>(
                    "Đã xảy ra lỗi khi lấy môn học",
                    new List<string> { ex.Message }
                );
            }
        }
        public async Task<ApiResponse<SubjectResponse>> GetSubjectByIdAsync(int id)
        {
            try
            {
                var subject = await _context.Subjects
                .Where(s => s.Id == id)
                .Select(s => new SubjectResponse
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                  //  Icon = s.Icon,
                    IsActive = s.IsActive,
                  //  DisplayOrder = s.DisplayOrder,
                    TotalClasses = s.Classes.Count(c => c.Status == Models.Enums.ClassStatus.Active)
                }).FirstOrDefaultAsync();

                if (subject == null)
                {
                    return new ApiResponse<SubjectResponse>(
                        "Không tìm thấy môn học",
                        new List<string> { "Subject không tồn tại" }
                    );
                }

                return new ApiResponse<SubjectResponse>
                (
                    subject,
                    "Lấy môn học qua id thành công"
                );
            }
            catch (Exception ex) 
            {
                return new ApiResponse<SubjectResponse>(
                    "Đã xảy ra lỗi khi lấy môn học",
                    new List<string> { ex.Message }
                );
            }
        }
    }
}
