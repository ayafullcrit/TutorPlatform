using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.Class;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Class;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;
using TutorPlatform.API.Services.Interfaces;
namespace TutorPlatform.API.Services.Implementations
{
    public class ClassService : IClassService
    {
        private readonly ApplicationDbContext _context;
        public ClassService(ApplicationDbContext context)
        {
            if (_context == null) _context = context;
        }
        //Create class
        public async Task<ApiResponse<ClassResponse>> CreateClassAsync(
            int tutorUserId,
            CreateClassRequest request
        )
        {
            try
            {
                var tutor = await _context.Tutors.FindAsync(tutorUserId);
                if (tutor == null)
                {
                    return new ApiResponse<ClassResponse>(
                        "Tutor không tồn tại",
                        new List<string> { "Chỉ gia sư mới có thể tạo lớp học" }
                    );
                }
                var subject = await _context.Subjects.FindAsync(request.SubjectId);
                if (subject == null)
                {
                    return new ApiResponse<ClassResponse>(
                       "Môn học không tồn tại",
                       new List<string> { "SubjectId không hợp lệ" }
                   );
                }
                var newClass = new Class
                {
                    TutorId = tutorUserId,
                    SubjectId = request.SubjectId,
                    Title = request.Title,
                    Description = request.Description,
                    ThumbnailUrl = request.ThumbnailUrl,
                    //Level = request.Level ?? "Beginner",
                    //Language = request.Language ?? "Tiếng Việt",
                    PricePerSession = request.PricePerSession,
                    DurationInMinutes = request.DurationMinutes,
                    TotalSessions = request.TotalSessions,
                    MaxStudents = request.MaxStudents,
                    CurrentStudents = 0,
                    Status = ClassStatus.Active,
                    GradeLevel = request.GradeLevel,
                    //IsOpenForBooking = true,
                    //ViewCount = 0,
                    //BookingCount = 0,
                    //CreatedAt = DateTime.UtcNow
                };
                //add class to database
                _context.Classes.Add(newClass);
                //save change
                await _context.SaveChangesAsync();

                //reload database after update
                var classResponse = await GetClassByIdAsync(newClass.Id);
                return new ApiResponse<ClassResponse>(
                    classResponse.Data,
                    "Tạo lớp học thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<ClassResponse>(
                   "Đã xảy ra lỗi khi tạo lớp học",
                   new List<string> { ex.Message }
               );
            }
        }
        public async Task<ApiResponse<ClassResponse>> GetClassByIdAsync(int id)
        {
            try
            {
                var classEntity = await _context.Classes
                    .Include(c => c.Tutor)
                        .ThenInclude(t => t.User)
                    .Include(c => c.Subject)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (classEntity == null)
                {
                    return new ApiResponse<ClassResponse>(
                        "Lớp học không tồn tại",
                        new List<string> { "Class không tìm thấy" }
                    );
                }

                var response = MapToClassResponse(classEntity);

                return new ApiResponse<ClassResponse>(
                    response,
                    "Lấy thông tin lớp học thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<ClassResponse>(
                   "Đã xảy ra lỗi",
                   new List<string> { ex.Message }
               );
            }
        }
        public async Task<ApiResponse<ClassResponse>> UpdateClassAsync(
            int tutorUserId,
            int classId,
            UpdateClassRequest request)
        {
            try
            {
                var classEntity = await _context.Classes
                    .Include(c => c.Tutor)
                        .ThenInclude(t => t.User)
                    .Include(c => c.Subject)
                    .FirstOrDefaultAsync(c => c.Id == classId);
                if (classEntity == null)
                {
                    return new ApiResponse<ClassResponse>(
                        "Lớp học không tồn tại",
                        new List<string> { "Class không tìm thấy" }
                    );
                }
                //verify ownership
                if (classEntity.TutorId != tutorUserId)
                {
                    return new ApiResponse<ClassResponse>(
                        "Không có quyền chỉnh sửa",
                        new List<string> { "Bạn không phải là người tạo lớp học này" }
                    );
                }
                //check exist subject
                var subject = await _context.Subjects.FindAsync(request.SubjectId);
                if (subject == null)
                {
                    return new ApiResponse<ClassResponse>(
                        "Môn học không tồn tại",
                        new List<string> { "SubjectId không hợp lệ" }
                    );
                }
                classEntity.SubjectId = request.SubjectId;
                classEntity.Title = request.Title;
                classEntity.Description = request.Description;
                classEntity.ThumbnailUrl = request.ThumbnailUrl;
                //classEntity.Level = request.Level;
                //classEntity.Language = request.Language;
                classEntity.PricePerSession = request.PricePerSession;
                classEntity.DurationInMinutes = request.DurationMinutes;
                classEntity.TotalSessions = request.TotalSessions;
                classEntity.MaxStudents = request.MaxStudents;
                classEntity.Status = request.Status;
                //classEntity.IsOpenForBooking = request.IsOpenForBooking;
                //classEntity.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var response = MapToClassResponse(classEntity);

                return new ApiResponse<ClassResponse>(
                    response,
                    "Cập nhật lớp học thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<ClassResponse>(
                    "Đã xảy ra lỗi khi cập nhật lớp học",
                    new List<string> { ex.Message }
                );
            }
        }
        public async Task<ApiResponse> DeleteClassAsync(int tutorUserId, int classId)
        {
            try
            {
                var classEntity = await _context.Classes.FirstOrDefaultAsync(c => c.Id == classId);
                if (classEntity == null)
                {
                    return new ApiResponse(
                         "Lớp học không tồn tại",
                         new List<String> { "Class không tìm thấy" }
                    );
                }
                if (classEntity.TutorId != tutorUserId)
                {
                    return new ApiResponse(
                        "Không có quyền xóa",
                        new List<string> { "Bạn không phải là người tạo lớp học này" }
                    );
                }
                //if isbooking...

                //else
                _context.Classes.Remove(classEntity);
                await _context.SaveChangesAsync();

                return new ApiResponse("Xóa lớp học thành công", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse(
                    "Đã xảy ra lỗi khi xóa lớp học",
                    new List<String> { ex.Message }
                    );
            }
        }
        public async Task<ApiResponse<PaginatedResponse<ClassResponse>>> SearchClassAsync(SearchClassRequest request)
        {
            try
            {
                var query = _context.Classes
                    .Include(c => c.Tutor)
                        .ThenInclude(t => t.User)
                    .Include(c => c.Subject)
                    .Where(c => c.Status == ClassStatus.Active)
                    .AsQueryable();
                //add filter

                //keyword filter
                if (!string.IsNullOrWhiteSpace(request.Keyword))
                {
                    query = query.Where(c =>
                            c.Title.Contains(request.Keyword) ||
                            c.Description.Contains(request.Keyword)// ||
                                                                   //c.Subject.Name.Contains(request.Keyword) ||
                                                                   //c.Tutor.User.FullName.Contains(request.Keyword)
                        );
                }

                // Filter by SubjectId
                if (request.SubjectId.HasValue)
                {
                    query = query.Where(c => c.SubjectId == request.SubjectId.Value);
                }

                if (request.Grade.HasValue)
                {
                    query = query.Where(c => c.GradeLevel == request.Grade.Value);
                }

                if (request.MinPrice.HasValue)
                {
                    query = query.Where(c => c.PricePerSession >= request.MinPrice.Value);
                }

                if (request.MaxPrice.HasValue)
                {
                    query = query.Where(c => c.PricePerSession <= request.MaxPrice.Value);
                }

                var totalCount = await query.CountAsync();
                //sort
                query = request.SortBy?.ToLower() switch
                {
                    "price" => request.SortOrder == "asc"
                        ? query.OrderBy(c => c.PricePerSession)
                        : query.OrderByDescending(c => c.PricePerSession),
                    _ => request.SortOrder == "asc"
                        ? query.OrderBy(c => c.Id)
                        : query.OrderByDescending(c => c.Id)
                    //"viewcount" => request.SortOrder == "asc"
                    //    ? query.OrderBy(c => c.ViewCount)
                    //    : query.OrderByDescending(c => c.ViewCount),
                };
                //pagination
                int pageSize = request.PageSize > 0 ? request.PageSize : 10;
                int page = request.Page > 0 ? request.Page : 1;

                var classes = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var classResponses = classes.Select(MapToClassResponse).ToList();

                var paginatedResponse = new PaginatedResponse<ClassResponse>(
                    classResponses,
                    totalCount,  
                    page,         
                    pageSize     
                );

                return new ApiResponse<PaginatedResponse<ClassResponse>>(
                    paginatedResponse,
                    "Tìm kiếm lớp học thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<PaginatedResponse<ClassResponse>>(
                   "Đã xảy ra lỗi khi tìm kiếm",
                   new List<string> { ex.Message }
               );
            }
        }

        public async Task<ApiResponse<List<ClassResponse>>> GetMyClassesAsync(int tutorUserId)
        {
            try
            {
                var classes = await _context.Classes
                    .Include(c => c.Tutor)
                        .ThenInclude(t => t.User)
                    .Include(c => c.Subject)
                    .Where(c => c.TutorId == tutorUserId)
                    //  .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                var classResponses = classes.Select(MapToClassResponse).ToList();

                return new ApiResponse<List<ClassResponse>>(
                    classResponses,
                    "Lấy danh sách lớp học thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<List<ClassResponse>>(
                    "Đã xảy ra lỗi",
                    new List<string> { ex.Message }
                );
            }
        }
        public async Task<ApiResponse<List<ClassResponse>>> GetClassesBySubjectAsync(int subjectId)
        {
            try
            {
                var classes = await _context.Classes
                    .Include(c => c.Tutor)
                        .ThenInclude(t => t.User)
                    .Include(c => c.Subject)
                    .Where(c => c.SubjectId == subjectId
                        && c.Status == ClassStatus.Active)
                    //   && c.IsOpenForBooking)
                    // .OrderByDescending(c => c.ViewCount)
                    .Take(20)
                    .ToListAsync();

                var classResponses = classes.Select(MapToClassResponse).ToList();

                return new ApiResponse<List<ClassResponse>>(
                    classResponses,
                    "Lấy danh sách lớp học theo môn thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<List<ClassResponse>>(
                    "Đã xảy ra lỗi",
                    new List<string> { ex.Message }
                );
            }
        }
        private ClassResponse MapToClassResponse(Models.Entities.Class classEntity)
        {
            return new ClassResponse
            {
                Id = classEntity.Id,

                // Tutor Info
                TutorUserId = classEntity.TutorId,
                TutorName = classEntity.Tutor?.User?.FullName ?? "Unknown",
                TutorAvatar = classEntity.Tutor?.User?.AvatarUrl,
                TutorRating = classEntity.Tutor?.Rating ?? 0,
                TutorTotalReviews = classEntity.Tutor?.TotalReviews ?? 0,

                // Subject Info
                SubjectId = classEntity.SubjectId,
                SubjectName = classEntity.Subject?.Name ?? "Unknown",
                // SubjectIcon = classEntity.Subject?.Icon,

                // Class Info
                Title = classEntity.Title,
                Description = classEntity.Description,
                ThumbnailUrl = classEntity.ThumbnailUrl,
                Grade = classEntity.GradeLevel,
                //  Language = classEntity.Language,

                PricePerSession = classEntity.PricePerSession,
                DurationMinutes = classEntity.DurationInMinutes,
                TotalSessions = classEntity.TotalSessions,

                // Capacity
                MaxStudents = classEntity.MaxStudents,
                CurrentStudents = classEntity.CurrentStudents,
                AvailableSlots = classEntity.MaxStudents - classEntity.CurrentStudents,

                // Status
                Status = classEntity.Status,
                StatusText = classEntity.Status.ToString(),
                //  IsOpenForBooking = classEntity.IsOpenForBooking,
                IsFull = classEntity.CurrentStudents >= classEntity.MaxStudents,

                // Metadata
                //ViewCount = classEntity.ViewCount,
                //BookingCount = classEntity.BookingCount,
                //CreatedAt = classEntity.CreatedAt,
                //UpdatedAt = classEntity.UpdatedAt
            };
        }
    }

}