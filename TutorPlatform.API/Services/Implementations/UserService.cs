using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.User;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.User;
using TutorPlatform.API.Models.Enums;
using TutorPlatform.API.Services.Interfaces;
namespace TutorPlatform.API.Services.Implementations
{
    public class UserService : IUserService
    {
        //singleton 
        private readonly ApplicationDbContext _context;
        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<UpdateProfileResponse>> GetProfileAsync(int UserId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Student)
                    .Include(u => u.Tutor).
                    FirstOrDefaultAsync(u => u.Id == UserId);
                if (user == null)
                {
                    return new ApiResponse<UpdateProfileResponse>(
                        "User không tồn tại",
                        new List<string> { "Không tìm thấy người dùng" }
                    );
                }
                var profile = MapToUserProfile(user);
                return new ApiResponse<UpdateProfileResponse>(
                    profile,
                    "Lấy thông tin user thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<UpdateProfileResponse>(
                    "Đã có lỗi xảy ra khi lấy thông tin người dùng",
                    new List<string> { ex.Message }
                );
            }
        }
        public async Task<ApiResponse<UpdateProfileResponse>> UpdateProfileAsync(int userId,
          UpdateProfileRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return new ApiResponse<UpdateProfileResponse>(
                        "User không tồn tại",
                        new List<string> { "Không tìm thấy người dùng" }
                    );
                }

                user.FullName = request.FullName;
                user.PhoneNumber = request.PhoneNumber;
                user.Address = request.Address;

                if (!string.IsNullOrWhiteSpace(request.AvatarUrl))
                {
                    user.AvatarUrl = request.AvatarUrl;
                }

                //update data
                await _context.SaveChangesAsync();
                //reload data
                user = await _context.Users.
                    Include(u => u.Student).
                    Include(u => u.Tutor).
                    FirstOrDefaultAsync(u => u.Id == userId);
                var profile = MapToUserProfile(user);
                return new ApiResponse<UpdateProfileResponse>(
                    profile,
                    "Cập nhật profile thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<UpdateProfileResponse>(
                    "Đã xảy ra lỗi khi update profile",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<UpdateProfileResponse>> UpdateStudentProfileAsync(
               int userId,
               UpdateStudentProfileRequest request)
        {
            try
            {
                var student = await _context.Students
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.UserId == userId);

                if (student == null)
                {
                    return new ApiResponse<UpdateProfileResponse>(
                        "Student không tồn tại",
                        new List<string> { "Người dùng không phải là học sinh" }
                    );
                }

                student.GradeLevel = request.GradeLevel;
                student.School = request.School;
                // student.LearningGoals = request.LearningGoals;

                await _context.SaveChangesAsync();

                var profile = MapToUserProfile(student.User);

                return new ApiResponse<UpdateProfileResponse>(
                    profile,
                    "Cập nhật thông tin học sinh thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<UpdateProfileResponse>(
                    "Đã xảy ra lỗi",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<UpdateProfileResponse>> UpdateTutorProfileAsync(
            int userId,
            UpdateTutorProfileRequest request)
        {
            try
            {
                var tutor = await _context.Tutors
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.UserId == userId);

                if (tutor == null)
                {
                    return new ApiResponse<UpdateProfileResponse>(
                        "Tutor không tồn tại",
                        new List<string> { "Người dùng không phải là gia sư" }
                    );
                }

                tutor.HourlyRate = request.HourlyRate;
                tutor.TotalReviews = request.TotalReviews;
                tutor.Rating = request.Rating;
                //tutor.Bio = request.Bio;
                //tutor.Education = request.Education;
                //tutor.Experience = request.Experience;
                //tutor.HourlyRate = request.HourlyRate;
                //tutor.VideoIntro = request.VideoIntro;
                //tutor.AvailableSchedule = request.AvailableSchedule;

                await _context.SaveChangesAsync();

                var profile = MapToUserProfile(tutor.User);

                return new ApiResponse<UpdateProfileResponse>(
                    profile,
                    "Cập nhật thông tin gia sư thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<UpdateProfileResponse>(
                    "Đã xảy ra lỗi",
                    new List<string> { ex.Message }
                );
            }
        }
    
     private UpdateProfileResponse MapToUserProfile(Models.Entities.User user)
        {
            var profile = new UpdateProfileResponse
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                AvatarUrl = user.AvatarUrl,
                Balance = user.Balance,
                Role = user.Role
            };

            if (user.Student != null)
            {
                profile.Student = new StudentProfile
                {
                    UserId = user.Student.UserId,
                    GradeLevel = user.Student.GradeLevel,
                    School = user.Student.School,
                 //   LearningGoals = user.Student.LearningGoals
                };
            }

            if (user.Tutor != null)
            {
                profile.Tutor = new TutorProfile
                {
                    UserId = user.Tutor.UserId,
                   // Bio = user.Tutor.Bio,
                  //  Education = user.Tutor.Education,
                  //  Experience = user.Tutor.Experience,
                    HourlyRate = user.Tutor.HourlyRate,
                  //  VideoIntro = user.Tutor.VideoIntro,
                    IsVerified = user.Tutor.IsVerified,
                    Rating = user.Tutor.Rating,
                    TotalReviews = user.Tutor.TotalReviews,
                  //  TotalHoursTaught = user.Tutor.TotalHoursTaught
                };
            }

            return profile;
        }
    }
}
