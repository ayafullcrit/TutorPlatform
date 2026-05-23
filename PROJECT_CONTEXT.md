# Project Context — TutorPlatform (PBL3-dev)

Repo path: `C:\Users\ADMIN\Downloads\PBL3-dev`

## 1) Tổng quan
- Mục tiêu: Nền tảng kết nối **học viên ↔ gia sư** (tạo lớp, đặt lịch/booking, ví/balance, giao dịch, thông báo).
- Kiến trúc:
  - Backend: ASP.NET Core (.NET 8), EF Core + SQL Server — `TutorPlatform.API`
  - Frontend: React (Create React App) — `TutorPlatform.Client\my-app`

## 2) Chạy dev
- Script chạy nhanh: `C:\Users\ADMIN\Downloads\PBL3-dev\start.bat`
- Backend (API): `http://localhost:5102`
  - Cấu hình ở `C:\Users\ADMIN\Downloads\PBL3-dev\TutorPlatform.API\Properties\launchSettings.json`
- Frontend (Client): `http://localhost:3000`
- Client gọi API base URL: `http://localhost:5102/api`
  - Cấu hình ở `C:\Users\ADMIN\Downloads\PBL3-dev\TutorPlatform.Client\my-app\src\services\api.js`

## 3) Backend entry & config
- Entry/DI/JWT/CORS/Swagger: `C:\Users\ADMIN\Downloads\PBL3-dev\TutorPlatform.API\Program.cs`
- App config: `C:\Users\ADMIN\Downloads\PBL3-dev\TutorPlatform.API\appsettings.json`
  - DB (mặc định): `Server=.\SQLEXPRESS;Database=TutorPlatformDB;Trusted_Connection=True;TrustServerCertificate=True`
  - JwtSettings: `SecretKey`, `Issuer`, `Audience`, `ExpirationInMinutes`

## 4) Controllers chính
Thư mục: `C:\Users\ADMIN\Downloads\PBL3-dev\TutorPlatform.API\Controllers`
- `AuthController`
- `UsersController`
- `StudentsController`
- `TutorsController`
- `BookingsController`
- `ClassesController`
- `SubjectsController`
- `ReviewsController`
- `PaymentsController`
- `MessagesController`
- `NotificationsController`
- `DashboardController`

## 5) Domain entities chính
Thư mục: `C:\Users\ADMIN\Downloads\PBL3-dev\TutorPlatform.API\Models\Entities`
- `User`: có `Balance`, `Role`, liên kết `Student` / `Tutor`
- `Student` / `Tutor`: dùng `UserId` làm khóa (1-1 với `User`)
- `Class`: `TutorId`, `PricePerSession`, `DurationInMinutes`, `CurrentStudents`, `MaxStudents`, `Status`
- `Booking`: `StudentId`, `TutorId`, `ClassId`, `Status`, `StartTime`, `EndTime`
- `Transaction`: sổ ví (ledger): `UserId`, `Amount` (+/-), `BalanceBefore/After`, `Type`, `ReferenceId`, `CreatedAt`

Enums:
- `BookingStatus`, `ClassStatus`, `UserRole`, `TransactionType` ở `C:\Users\ADMIN\Downloads\PBL3-dev\TutorPlatform.API\Models\Enums`

## 6) Wallet / Transaction model (quan trọng)
- Ghi sổ ví dùng: `PaymentService.RecordTransactionAsync(userId, amount, type, description, referenceId)`
  - Logic: cập nhật `User.Balance += amount` và tạo record `Transaction`
  - `amount` âm = trừ tiền, dương = cộng tiền
- `TransactionType`:
  - `TopUp` (nạp)
  - `BookingPay` (trừ tiền khi đặt)
  - `Refund` (hoàn tiền)
  - `Earning` (thu nhập tutor; cũng dùng số âm để điều chỉnh/thu hồi)
  - `Withdrawal` (rút)

## 7) Booking money flow (business logic)
File trung tâm: `C:\Users\ADMIN\Downloads\PBL3-dev\TutorPlatform.API\Services\Implementations\BookingService.cs`

Luồng chuẩn:
1) Student tạo booking:
   - Trừ tiền student bằng `TransactionType.BookingPay` (amount âm)
2) Tutor xác nhận booking (Confirm):
   - Payout cho tutor theo tỉ lệ (platform fee) bằng `TransactionType.Earning`
   - Idempotent: nếu đã tồn tại transaction Earning cho booking (theo `ReferenceId = bookingId`) thì bỏ qua
3) Hoàn thành booking (Complete):
   - Chỉ payout nếu booking chưa được payout từ trước (để tương thích nếu UI có gọi Complete)
4) Hủy booking:
   - Tutor hủy: refund 100% cho student + thu hồi payout tutor (nếu đã payout)
   - Student hủy:
     - Pending: refund 100%
     - Confirmed: refund 80% (phạt 20%)
     - Nếu đã payout tutor: điều chỉnh payout theo phần tiền “giữ lại” sau refund

## 8) Lưu ý tooling
- `dotnet build` đôi khi lỗi quyền đọc `C:\Users\ADMIN\AppData\Roaming\NuGet\NuGet.Config`
  - Workaround: dùng `dotnet restore --configfile <file-config-trong-workspace>` rồi `dotnet build --no-restore`

