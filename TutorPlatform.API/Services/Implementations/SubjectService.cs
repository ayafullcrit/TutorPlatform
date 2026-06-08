using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.Subject;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Subject;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Implementations
{
    public class SubjectService : ISubjectService
    {
        private readonly ApplicationDbContext _context;

        public SubjectService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<SubjectResponse>>> GetAllSubjectAsync()
        {
            try
            {
                var subjects = await _context.Subjects
                    .Select(s => new SubjectResponse
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Description = s.Description,
                        IsActive = s.IsActive,
                        TotalClasses = s.Classes.Count(c => c.Status == Models.Enums.ClassStatus.Active)
                    })
                    .ToListAsync();

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
                        IsActive = s.IsActive,
                        TotalClasses = s.Classes.Count(c => c.Status == Models.Enums.ClassStatus.Active)
                    })
                    .FirstOrDefaultAsync();

                if (subject == null)
                {
                    return new ApiResponse<SubjectResponse>(
                        "Không tìm thấy môn học",
                        new List<string> { "Subject không tồn tại" }
                    );
                }

                return new ApiResponse<SubjectResponse>(
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

        public async Task<ApiResponse<SubjectResponse>> UpdateSubjectAsync(int id, UpdateSubjectRequest request)
        {
            try
            {
                var subject = await _context.Subjects
                    .Include(s => s.Classes)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (subject == null)
                {
                    return new ApiResponse<SubjectResponse>(
                        "Không tìm thấy môn học",
                        new List<string> { "Subject không tồn tại" }
                    );
                }

                var normalizedName = request.Name.Trim();
                var duplicateExists = await _context.Subjects.AnyAsync(s =>
                    s.Id != id &&
                    s.Name.ToLower() == normalizedName.ToLower());

                if (duplicateExists)
                {
                    return new ApiResponse<SubjectResponse>(
                        "Tên môn học đã tồn tại",
                        new List<string> { "Vui lòng chọn tên môn học khác" }
                    );
                }

                subject.Name = normalizedName;
                subject.Description = request.Description?.Trim() ?? string.Empty;
                subject.IsActive = request.IsActive;

                await _context.SaveChangesAsync();

                return new ApiResponse<SubjectResponse>(
                    new SubjectResponse
                    {
                        Id = subject.Id,
                        Name = subject.Name,
                        Description = subject.Description,
                        IsActive = subject.IsActive,
                        TotalClasses = subject.Classes.Count(c => c.Status == Models.Enums.ClassStatus.Active)
                    },
                    "Cập nhật môn học thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<SubjectResponse>(
                    "Đã xảy ra lỗi khi cập nhật môn học",
                    new List<string> { ex.Message }
                );
            }
        }
    }
}
