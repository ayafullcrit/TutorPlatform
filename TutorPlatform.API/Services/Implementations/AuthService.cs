using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.Auth;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Auth;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;
using TutorPlatform.API.Services.Helper;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Implementations
{
    /// <summary>
    /// Service xử lý Authentication
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(ApplicationDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        // ============================================
        // ĐĂNG KÝ
        // ============================================

        public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // 1. Kiểm tra email
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (existingUser != null)
                {
                    return new ApiResponse<AuthResponse>(
                        "Email đã được sử dụng",
                        new List<string> { "Email đã tồn tại trong hệ thống" }
                    );
                }

                // 2. Hash password
                Console.WriteLine("Hashing password...");
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                Console.WriteLine("Password hashed successfully");

                // 3. Tạo User
                Console.WriteLine("Creating user entity...");
                var user = new User
                {
                    Email = request.Email,
                    PasswordHash = passwordHash,
                    FullName = request.FullName,
                    PhoneNumber = request.PhoneNumber,
                    Role = request.Role,
                    IsActivated = true,
                    Balance = 0,                    
                };
                user.Balance = 0;
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                Console.WriteLine($"User created with ID: {user.Id}");

                // 4. Tạo Student/Tutor
                if (request.Role == UserRole.Student)
                {
                    Console.WriteLine("Creating student record...");

                    var student = new Student
                    {
                        UserId = user.Id,  // ✅ UserId = Primary Key
                        GradeLevel = request.Grade ?? 10,
                        School = request.School,
                    };

                    _context.Students.Add(student);
                    await _context.SaveChangesAsync();

                    // Reload user with Student
                    user = await _context.Users
                        .Include(u => u.Student)
                        .FirstOrDefaultAsync(u => u.Id == user.Id);

                    Console.WriteLine($"Student created, UserId: {student.UserId}");
                }
                else if (request.Role == UserRole.Tutor)
                {
                    Console.WriteLine("Creating tutor record...");

                    var tutor = new Tutor
                    {
                        UserId = user.Id,  // ✅ UserId = Primary Key
                        HourlyRate = 0,
                        IsVerified = false,
                        Rating = 0,
                        TotalReviews = 0,
                        //TotalHoursTaught = 0
                    };

                    _context.Tutors.Add(tutor);
                    await _context.SaveChangesAsync();
                        
                    // Reload user with Tutor
                    user = await _context.Users
                        .Include(u => u.Tutor)
                        .FirstOrDefaultAsync(u => u.Id == user.Id);

                    Console.WriteLine($"Tutor created, UserId: {tutor.UserId}");
                }

                // 5. Tạo JWT token
                Console.WriteLine("Generating JWT token...");
                string token;

                try
                {
                    token = _jwtHelper.GenerateToken(user);
                    Console.WriteLine("JWT token generated successfully");
                }
                catch (Exception jwtEx)
                {
                    Console.WriteLine($"JWT ERROR: {jwtEx.Message}");
                    Console.WriteLine($"JWT StackTrace: {jwtEx.StackTrace}");
                    throw; // Re-throw để outer catch bắt
                }

                var expiresAt = _jwtHelper.GetTokenExpirationTime();

                // 6. Tạo response
                var authResponse = new AuthResponse
                {
                    Token = token,
                    ExpiresAt = expiresAt,
                    User = MapToUserInfo(user)
                };

                Console.WriteLine("Registration completed successfully");

                return new ApiResponse<AuthResponse>(
                    authResponse,
                    "Đăng ký thành công"
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"=== REGISTRATION ERROR ===");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                Console.WriteLine($"InnerException: {ex.InnerException?.Message}");
                Console.WriteLine($"========================");

                return new ApiResponse<AuthResponse>(
                    "Đã xảy ra lỗi khi đăng ký",
                    new List<string>
                    {
                ex.Message,
                ex.InnerException?.Message ?? "No inner exception"
                    }
                );
            }
        }

        // ============================================
        // ĐĂNG NHẬP
        // ============================================

        public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
        {
            try
            {
                // 1. Tìm user theo email
                var user = await _context.Users
                    .Include(u => u.Student)
                    .Include(u => u.Tutor)
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null)
                {
                    return new ApiResponse<AuthResponse>(
                        "Email hoặc mật khẩu không đúng",
                        new List<string> { "Thông tin đăng nhập không hợp lệ" }
                    );
                }

                // 2. Kiểm tra tài khoản có active không
                if (!user.IsActivated)
                {
                    return new ApiResponse<AuthResponse>(
                        "Tài khoản đã bị khóa",
                        new List<string> { "Vui lòng liên hệ admin để biết thêm chi tiết" }
                    );
                }

                // 3. Verify password
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

                if (!isPasswordValid)
                {
                    return new ApiResponse<AuthResponse>(
                        "Email hoặc mật khẩu không đúng",
                        new List<string> { "Thông tin đăng nhập không hợp lệ" }
                    );
                }

                // 4. Tạo JWT token
                var token = _jwtHelper.GenerateToken(user);
                var expiresAt = _jwtHelper.GetTokenExpirationTime();

                // 5. Tạo response
                var authResponse = new AuthResponse
                {
                    Token = token,
                    ExpiresAt = expiresAt,
                    User = MapToUserInfo(user)
                };

                return new ApiResponse<AuthResponse>(
                    authResponse,
                    "Đăng nhập thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<AuthResponse>(
                    "Đã xảy ra lỗi khi đăng nhập",
                    new List<string> { ex.Message }
                );
            }
        }

        // ============================================
        // ĐỔI MẬT KHẨU
        // ============================================

        public async Task<ApiResponse> ChangePasswordAsync(int userId, ChangePasswordRequest request)
        {
            try
            {
                // 1. Tìm user
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return new ApiResponse("User không tồn tại", false);
                }

                // 2. Verify mật khẩu hiện tại
                bool isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(
                    request.CurrentPassword,
                    user.PasswordHash
                );

                if (!isCurrentPasswordValid)
                {
                    return new ApiResponse(
                        "Mật khẩu hiện tại không đúng",
                        new List<string> { "Vui lòng kiểm tra lại mật khẩu hiện tại" }
                    );
                }

                // 3. Hash mật khẩu mới
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                //user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new ApiResponse("Đổi mật khẩu thành công", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse(
                    "Đã xảy ra lỗi khi đổi mật khẩu",
                    new List<string> { ex.Message }
                );
            }
        }

        // ============================================
        // LẤY THÔNG TIN USER HIỆN TẠI
        // ============================================

        public async Task<ApiResponse<UserInfo>> GetCurrentUserAsync(int userId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Student)
                    .Include(u => u.Tutor)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return new ApiResponse<UserInfo>(
                        "User không tồn tại",
                        new List<string> { "Không tìm thấy thông tin người dùng" }
                    );
                }

                var userInfo = MapToUserInfo(user);

                return new ApiResponse<UserInfo>(
                    userInfo,
                    "Lấy thông tin user thành công"
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<UserInfo>(
                    "Đã xảy ra lỗi",
                    new List<string> { ex.Message }
                );
            }
        }

        // ============================================
        // HELPER METHODS
        // ============================================

        private UserInfo MapToUserInfo(User user)
        {
            return new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Avatar = user.AvatarUrl,
                Role = user.Role,
                Balance = user.Balance,
                //  IsEmailVerified = user.IsEmailVerified,
                IsTutorVerified = user.Tutor?.IsVerified
            };
        }
    }
}
