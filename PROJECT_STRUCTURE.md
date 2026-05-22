# 📚 TutorPlatform - Cấu Trúc Dự Án

Đây là hướng dẫn chi tiết về cấu trúc và chức năng của các thư mục trong dự án **TutorPlatform** - một nền tảng kết nối học viên với gia sư trực tuyến.

---

## 📋 Mục lục

1. [Cấu trúc Tổng quan](#cấu-trúc-tổng-quan)
2. [Backend API (.NET)](#backend-api-net)
3. [Frontend Client (React)](#frontend-client-react)
4. [Các Pattern & Kiến trúc](#các-pattern--kiến-trúc)
5. [Cơ sở dữ liệu](#cơ-sở-dữ-liệu)

---

## 🗂️ Cấu Trúc Tổng quan

```
PBL3-dev/
├── TutorPlatform.slnx              ← Visual Studio Solution file
├── TutorPlatform.API/              ← Backend C# .NET 8 API
│   ├── Program.cs
│   ├── appsettings.json
│   ├── Controllers/                ← API Endpoints (12 controllers)
│   ├── Models/                     ← Database entities + DTOs
│   ├── Services/                   ← Business logic layer
│   ├── Data/                       ← Database context & configs
│   └── Migrations/                 ← Database version control
│
└── TutorPlatform.Client/           ← Frontend React application
    └── my-app/
        ├── public/                 ← Static assets
        └── src/                    ← React components & pages
            ├── Components/
            ├── Pages/
            ├── Services/
            ├── Layouts/
            └── Styles/
```

---

## 🔧 Backend API (.NET)

### Tổng quan
- **Framework**: .NET 8 (C#)
- **Database**: SQL Server
- **Authentication**: JWT Bearer tokens
- **Architecture**: Service Layer Pattern + Dependency Injection

### 📁 Cấu Trúc Backend

#### **Program.cs** - Điểm vào của ứng dụng
Trách vụ chính:
- Cấu hình services (Dependency Injection)
- Thiết lập middleware (CORS, JWT, Authorization)
- Kết nối database
- Cấu hình Swagger documentation

```csharp
// Ví dụ cấu trúc
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
app.UseAuthentication();
app.UseAuthorization();
```

#### **appsettings.json** - Cấu hình ứng dụng
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "SQL Server connection string"
  },
  "JwtSettings": {
    "Secret": "Secret key for JWT",
    "Issuer": "TutorPlatform",
    "Audience": "TutorPlatformUsers"
  }
}
```

#### **Controllers/** - API Endpoints (12 Controllers)

| Controller | Chức năng |
|-----------|----------|
| **AuthController** | Đăng ký, đăng nhập, tạo JWT tokens |
| **UsersController** | Quản lý hồ sơ người dùng |
| **StudentsController** | Tìm kiếm gia sư, xem đơn đặt lịch |
| **TutorsController** | Quản lý hồ sơ gia sư |
| **BookingController** | Tạo, cập nhật, hủy đơn đặt lịch |
| **ClassesController** | CRUD lớp học |
| **SubjectsController** | Quản lý môn học |
| **ReviewsController** | Thêm, xem, xóa bài review |
| **PaymentsController** | Xử lý thanh toán |
| **MessagesController** | Gửi và nhận tin nhắn |
| **NotificationsController** | Tạo và quản lý thông báo |
| **DashboardController** | Lấy dữ liệu thống kê |

#### **Models/** - Dữ liệu

##### **Entities/** - Mô hình cơ sở dữ liệu

| Entity | Mô tả |
|--------|------|
| **User** | Người dùng (Id, Email, PasswordHash, FullName, Balance, Role) |
| **Student** | Học viên (kế thừa từ User + thông tin trường học) |
| **Tutor** | Gia sư (kế thừa từ User + chuyên môn) |
| **Class** | Lớp học (mã, tên, loại: online/offline/hybrid) |
| **Subject** | Môn học (toán, tiếng anh, etc.) |
| **Booking** | Đơn đặt lịch (student - tutor - class) |
| **Review** | Bài đánh giá (rating, comment) |
| **Payment** | Thanh toán (số tiền, trạng thái) |
| **Message** | Tin nhắn (sender - receiver - content) |
| **Notification** | Thông báo hệ thống |
| **Transaction** | Giao dịch tài chính (nạp, rút, hoàn tiền) |

##### **DTOs/** - Data Transfer Objects (yêu cầu/phản hồi)

```
DTOs/
├── Requests/
│   ├── AuthRequests.cs          (RegisterRequest, LoginRequest)
│   ├── BookingRequests.cs
│   ├── ClassRequests.cs
│   ├── PaymentRequests.cs
│   ├── ReviewRequests.cs
│   └── UserRequests.cs
├── Responses/
│   ├── AuthResponse.cs          (User + Token)
│   ├── BookingResponse.cs
│   ├── ClassResponse.cs
│   ├── NotificationResponse.cs
│   ├── PaginationResponse.cs
│   ├── PaymentResponse.cs
│   ├── ReviewResponse.cs
│   ├── SubjectResponse.cs
│   └── UserResponse.cs
└── ApiResponse.cs               (Wrapper cho tất cả API responses)
```

##### **Enums/** - Giá trị enum

```
Enums/
├── UserRole              → Admin, Student, Tutor
├── BookingStatus         → Pending, Confirmed, Completed, Cancelled
├── ClassStatus           → Active, Inactive, Archived
├── ClassType             → Online, In-person, Hybrid
├── PaymentStatus         → Pending, Completed, Failed, Refunded
└── TransactionType       → Deposit, Withdrawal, Refund
```

#### **Services/** - Lớp xử lý logic

##### **Interfaces/** - Hợp đồng dịch vụ
```
Interfaces/
├── IAuthService          → Xác thực người dùng
├── IUserService          → Quản lý người dùng
├── IStudentService       → Quản lý học viên
├── ITutorService         → Quản lý gia sư
├── IBookingService       → Quản lý đặt lịch
├── IClassService         → Quản lý lớp học
├── ISubjectService       → Quản lý môn học
├── IReviewService        → Quản lý bài review
├── IPaymentService       → Xử lý thanh toán
├── IMessageService       → Quản lý tin nhắn
└── INotificationService  → Quản lý thông báo
```

##### **Implementations/** - Triển khai dịch vụ
```
Implementations/
├── AuthService           → Register, Login, Token generation
├── UserService           → Profile updates, User queries
├── StudentService        → Find tutors, View bookings
├── TutorService          → Profile management, Class creation
├── BookingService        → Create, Update, Cancel bookings
├── ClassService          → CRUD operations
├── SubjectService        → Subject CRUD
├── ReviewService         → Add, retrieve, delete reviews
├── PaymentService        → Process payments
├── MessageService        → Send/receive messages
└── NotificationService   → Create and manage notifications
```

##### **Helpers/** - Hàm tiện ích
```
Helpers/
├── JwtHelper             → Tạo & validate JWT tokens
├── PasswordHasher        → Hash password với BCrypt
└── BookingNotificationHelper → Trigger notifications
```

#### **Data/** - Cấu hình cơ sở dữ liệu

##### **ApplicationDbContext.cs**
- Entity Framework DbContext
- Định nghĩa tất cả entities
- Kết nối SQL Server

##### **Configurations/** - Fluent API mappings
```
Configurations/
├── UserConfiguration.cs
├── StudentConfiguration.cs
├── TutorConfiguration.cs
├── BookingConfiguration.cs
├── ClassConfiguration.cs
├── SubjectConfiguration.cs
├── ReviewConfiguration.cs
├── MessageConfiguration.cs
├── NotificationConfiguration.cs
└── TransactionConfiguration.cs
```

#### **Migrations/** - Quản lý phiên bản cơ sở dữ liệu

| Migration | Ngày | Mô tả |
|-----------|------|------|
| `20260302114246_IntitalCreate` | 02/03 | Tạo schema ban đầu |
| `20260302171419_SeedData` | 02/03 | Seed dữ liệu ban đầu |
| `20260304120624_fixnullbalance` | 04/03 | Sửa nullable balance |
| `20260313151035_Add student's school` | 13/03 | Thêm trường school |
| `20260330101542_SubjectsAndClasses` | 30/03 | Thêm tables Subjects & Classes |
| `20260403150009_InitialCreate` | 03/04 | Cấu trúc lại schema |
| `20260416145651_AddTransactions` | 16/04 | Thêm Transaction tracking |
| `20260420124306_AddNotiTable` | 20/04 | Thêm Notification table |

---

## ⚛️ Frontend Client (React)

### Tổng quan
- **Framework**: React 18.3
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM 7.14
- **Architecture**: Component-based, Service layer pattern

### 📁 Cấu Trúc Frontend

#### **public/** - Tài sản tĩnh
```
public/
├── index.html           ← Main HTML entry point
├── favicon.ico
├── manifest.json        ← PWA configuration
├── robots.txt           ← SEO robots
├── logo192.png, logo512.png
└── anonymous.jpg        ← Default avatar
```

#### **src/** - Mã nguồn React

##### **index.js & App.js**
- `index.js`: Render ứng dụng React vào DOM
- `App.js`: Định tuyến chính và cấu hình routes cho 3 roles

##### **Layouts/** - Bố cục theo vai trò
```
Layouts/
├── AdminLayout.jsx      ← Bố cục Dashboard Admin
├── StudentLayout.jsx    ← Bố cục Dashboard Học viên
└── TutorLayout.jsx      ← Bố cục Dashboard Gia sư
```

##### **Components/** - Các thành phần tái sử dụng

**Admin Components** (5 components):
```
admin/
├── Button.jsx
├── Header.jsx           ← Header bar
├── Sidebar.jsx          ← Navigation sidebar
├── StatCard.jsx         ← Thẻ thống kê
└── Topbar.jsx           ← Top navigation
```

**Student Components** (8 components):
```
student/
├── EmptyState.jsx       ← Trạng thái trống
├── ErrorState.jsx       ← Trạng thái lỗi
├── LazyAvatar.jsx       ← Avatar tải chậm
├── StatCard.jsx         ← Thẻ thống kê
├── StudentSidebar.jsx
├── StudentTopbar.jsx
├── TutorCard.jsx        ← Hiển thị profile gia sư
└── TutorCardSkeleton.jsx ← Loading skeleton
```

**Tutor Components** (10 components):
```
tutor/
├── EmptyState.jsx
├── ErrorState.jsx
├── SkeletonCard.jsx
├── TutorChartCard.jsx   ← Biểu đồ thống kê
├── TutorClassCard.jsx   ← Thẻ lớp học
├── TutorRequestCard.jsx ← Thẻ yêu cầu
├── TutorSidebar.jsx
├── TutorStatCard.jsx
├── TutorStudentTable.jsx ← Bảng danh sách học viên
├── TutorTopbar.jsx
└── TutorTransactionItem.jsx ← Item giao dịch
```

##### **Pages/** - Các trang đầy đủ

**Authentication Pages**:
```
├── Home.jsx             ← Trang chủ
├── Login.jsx            ← Đăng nhập
└── Register.jsx         ← Đăng ký
```

**Admin Pages** (6 trang):
```
admin/
├── AdminDashboard.jsx   ← Tổng quan & thống kê
├── Accounts.jsx         ← Quản lý tài khoản người dùng
├── Verifications.jsx    ← Xác minh gia sư
├── Transactions.jsx     ← Lịch sử giao dịch tài chính
├── SystemConfig.jsx     ← Cấu hình hệ thống
└── ClassManagement.jsx  ← Quản lý lớp học
```

**Student Pages** (4 trang):
```
student/
├── StudentDashboard.jsx ← Bảng điều khiển học viên
├── FindTutor.jsx        ← Tìm kiếm & lọc gia sư
├── Schedule.jsx         ← Xem & quản lý lịch học
└── Profile.jsx          ← Hồ sơ cá nhân
```

**Tutor Pages** (7 trang):
```
tutor/
├── Dashboard.jsx        ← Tổng quan & thống kê
├── Classes.jsx          ← Quản lý các lớp học
├── Students.jsx         ← Quản lý danh sách học viên
├── Schedule.jsx         ← Lập lịch học
├── Finance.jsx          ← Tổng quan tài chính
├── Profile.jsx          ← Hồ sơ gia sư
└── Subjects.jsx         ← Quản lý môn học
```

##### **Routes/** - Bảo vệ route
```
Routes/
└── AdminRoute.jsx       ← Protected route cho admin-only access
```

##### **Services/** - Lớp tích hợp API

```
Services/
├── api.js               ← Cấu hình Axios instance & base URL
├── authService.js       ← Login, Register, Logout
├── userService.js       ← User profile operations
├── classService.js      ← Class API calls
├── dashboardService.js  ← Lấy dữ liệu dashboard
├── subjectService.js    ← Subject operations
└── transactionService.js ← Payment & transaction calls
```

**Ví dụ api.js**:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Add JWT token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

##### **Mock Data/** - Dữ liệu giả định cho phát triển

```
Mock/
├── mockDashboard.js         ← Dữ liệu dashboard admin
├── mockTransactions.js      ← Lịch sử giao dịch
├── mockTutorClasses.js      ← Lớp học của gia sư
├── mockTutorDashboard.js    ← Dashboard gia sư
├── mockTutorFinance.js      ← Dữ liệu tài chính gia sư
├── mockTutorStudents.js     ← Danh sách học viên
├── mockTutorSubjects.js     ← Môn học
└── mockUsers.js             ← Dữ liệu người dùng
```

##### **Styles/** - CSS Styling

**Global Styles**:
```
├── index.css            ← Global CSS
└── tokens.css           ← CSS variables (design tokens)
```

**Component Styles**:
```
├── student-dashboard.css
├── student-layout.css
├── student-sidebar.css
├── student-tutor-card.css
├── tutor/
│   ├── tutor-card.css
│   ├── tutor-classes.css
│   ├── tutor-dashboard.css
│   ├── tutor-finance.css
│   ├── tutor-layout.css
│   ├── tutor-sidebar.css
│   ├── tutor-students.css
│   ├── tutor-subjects.css
│   └── tutor-tokens.css
```

---

## 🏗️ Các Pattern & Kiến trúc

### Backend Patterns (C# .NET)

| Pattern | Mô tả | Ví dụ |
|---------|------|-------|
| **Service Layer** | Business logic tách riêng | AuthService, UserService |
| **Repository Pattern** | Truy cập database qua DbContext | Entity Framework Core |
| **Dependency Injection** | Quản lý dependencies tự động | `AddScoped<IService, Service>()` |
| **DTO Pattern** | Tách dữ liệu từ database | `UserResponse` vs `User` entity |
| **JWT Authentication** | Xác thực không trạng thái | Tokens được ký bằng secret key |
| **Role-Based Authorization** | Phân quyền theo vai trò | [Authorize(Roles = "Admin")] |
| **Fluent API** | Cấu hình Entity Framework | `modelBuilder.Entity<User>().HasKey(u => u.Id)` |

### Frontend Patterns (React)

| Pattern | Mô tả | Ví dụ |
|---------|------|-------|
| **Component-Based** | UI chia nhỏ thành components | `StudentCard.jsx`, `TutorCard.jsx` |
| **Layout Pattern** | Bố cục dùng chung cho tất cả pages | `AdminLayout`, `StudentLayout` |
| **Service Layer** | API calls tập trung | `authService.js`, `classService.js` |
| **Protected Routes** | Route chỉ cho authenticated users | `AdminRoute.jsx` |
| **Mock Data** | Dữ liệu giả cho phát triển | `mockDashboard.js` |
| **CSS Modules** | Styling component-scoped | Tailwind CSS + component CSS |

---

## � Frontend-Backend Integration Map

### Các API Endpoints & UI Components tương ứng

#### **1. Authentication (AuthController) ↔ Login/Register Pages**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: AuthController                             │
├─────────────────────────────────────────────────────┤
│ POST /api/auth/register                             │
│ POST /api/auth/login                                │
│ POST /api/auth/logout                               │
│ POST /api/auth/refresh-token                        │
└─────────────────────────────────────────────────────┘
                          ↓ (Axios calls)
┌─────────────────────────────────────────────────────┐
│ FRONTEND: authService.js                            │
├─────────────────────────────────────────────────────┤
│ • register(email, password, fullName, role)         │
│ • login(email, password)                            │
│ • logout()                                          │
│ • refreshToken()                                    │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Pages                                     │
├─────────────────────────────────────────────────────┤
│ • Register.jsx - Đăng ký (Student/Tutor)           │
│ • Login.jsx - Đăng nhập                            │
│ • Home.jsx - Landing page                          │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: Xác thực người dùng, quản lý JWT tokens

---

#### **2. Users Management (UsersController) ↔ Profile Pages**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: UsersController                            │
├─────────────────────────────────────────────────────┤
│ GET /api/users/{id}                                 │
│ PUT /api/users/{id}                                 │
│ GET /api/users/profile                              │
│ DELETE /api/users/{id}                              │
│ PUT /api/users/{id}/avatar                          │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: userService.js                            │
├─────────────────────────────────────────────────────┤
│ • getProfile()                                      │
│ • updateProfile(userData)                           │
│ • getUserById(id)                                   │
│ • uploadAvatar(file)                                │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Pages                                     │
├─────────────────────────────────────────────────────┤
│ • student/Profile.jsx - Hồ sơ học viên             │
│ • tutor/Profile.jsx - Hồ sơ gia sư                 │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: Cập nhật thông tin cá nhân, avatar, hồ sơ

---

#### **3. Subjects (SubjectsController) ↔ Subject Management**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: SubjectsController                         │
├─────────────────────────────────────────────────────┤
│ GET /api/subjects                                   │
│ GET /api/subjects/{id}                              │
│ POST /api/subjects                                  │
│ PUT /api/subjects/{id}                              │
│ DELETE /api/subjects/{id}                           │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: subjectService.js                         │
├─────────────────────────────────────────────────────┤
│ • getSubjects()                                     │
│ • getSubjectById(id)                                │
│ • createSubject(data)                               │
│ • updateSubject(id, data)                           │
│ • deleteSubject(id)                                 │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Pages                                     │
├─────────────────────────────────────────────────────┤
│ • tutor/Subjects.jsx - Quản lý môn học             │
│ • admin/ClassManagement.jsx - Quản lý môn (admin)  │
│ • student/FindTutor.jsx - Lọc theo môn            │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: Danh sách môn học, tạo/cập nhật/xóa môn

---

#### **4. Classes (ClassesController) ↔ Classes Management**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: ClassesController                          │
├─────────────────────────────────────────────────────┤
│ GET /api/classes                                    │
│ GET /api/classes/{id}                               │
│ POST /api/classes                                   │
│ PUT /api/classes/{id}                               │
│ DELETE /api/classes/{id}                            │
│ GET /api/classes/tutor/{tutorId}                    │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: classService.js                           │
├─────────────────────────────────────────────────────┤
│ • getClasses()                                      │
│ • getClassById(id)                                  │
│ • getClassesByTutor(tutorId)                        │
│ • createClass(classData)                            │
│ • updateClass(id, classData)                        │
│ • deleteClass(id)                                   │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Pages & Components                        │
├─────────────────────────────────────────────────────┤
│ • tutor/Classes.jsx - Danh sách lớp của gia sư     │
│ • tutor/TutorClassCard.jsx - Thẻ lớp              │
│ • student/Schedule.jsx - Xem lịch lớp              │
│ • admin/ClassManagement.jsx - Quản lý lớp (admin)  │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: CRUD lớp học, hiển thị lớp theo gia sư, lịch học

---

#### **5. Bookings (BookingController) ↔ Booking Management**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: BookingController                          │
├─────────────────────────────────────────────────────┤
│ GET /api/bookings                                   │
│ GET /api/bookings/{id}                              │
│ POST /api/bookings                                  │
│ PUT /api/bookings/{id}                              │
│ DELETE /api/bookings/{id}                           │
│ GET /api/bookings/student/{studentId}               │
│ GET /api/bookings/tutor/{tutorId}                   │
│ PUT /api/bookings/{id}/confirm                      │
│ PUT /api/bookings/{id}/cancel                       │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: bookingService.js (cần tạo)              │
├─────────────────────────────────────────────────────┤
│ • getBookings()                                     │
│ • getBookingById(id)                                │
│ • createBooking(bookingData)                        │
│ • updateBooking(id, bookingData)                    │
│ • confirmBooking(id)                                │
│ • cancelBooking(id)                                 │
│ • getStudentBookings(studentId)                     │
│ • getTutorBookings(tutorId)                         │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Pages                                     │
├─────────────────────────────────────────────────────┤
│ • student/Schedule.jsx - Quản lý đặt lịch          │
│ • tutor/Schedule.jsx - Xem & xác nhận booking       │
│ • student/FindTutor.jsx - Nút đặt lịch            │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: Tạo/xác nhận/hủy booking, danh sách booking

---

#### **6. Students (StudentsController) ↔ Student Dashboard**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: StudentsController                         │
├─────────────────────────────────────────────────────┤
│ GET /api/students/{id}                              │
│ PUT /api/students/{id}                              │
│ GET /api/students/search                            │
│ GET /api/students/{id}/bookings                     │
│ GET /api/students/{id}/reviews                      │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: studentService.js (cần tạo)              │
├─────────────────────────────────────────────────────┤
│ • getStudent(id)                                    │
│ • updateStudent(id, data)                           │
│ • searchStudents(query)                             │
│ • getStudentBookings(id)                            │
│ • getStudentReviews(id)                             │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Pages                                     │
├─────────────────────────────────────────────────────┤
│ • student/StudentDashboard.jsx - Bảng điều khiển   │
│ • student/Profile.jsx - Hồ sơ học viên             │
│ • tutor/Students.jsx - Quản lý học viên (gia sư)   │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: Thông tin học viên, booking, review

---

#### **7. Tutors (TutorsController) ↔ Tutor Discovery & Management**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: TutorsController                           │
├─────────────────────────────────────────────────────┤
│ GET /api/tutors                                     │
│ GET /api/tutors/{id}                                │
│ PUT /api/tutors/{id}                                │
│ GET /api/tutors/search                              │
│ GET /api/tutors/{id}/reviews                        │
│ GET /api/tutors/{id}/classes                        │
│ GET /api/tutors/{id}/rating                         │
│ PUT /api/tutors/{id}/verify (admin)                 │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: tutorService.js (cần tạo)                │
├─────────────────────────────────────────────────────┤
│ • getTutors(filters)                                │
│ • getTutorById(id)                                  │
│ • searchTutors(query, filters)                      │
│ • getTutorRating(id)                                │
│ • getTutorReviews(id)                               │
│ • getTutorClasses(id)                               │
│ • updateTutor(id, data)                             │
│ • verifyTutor(id) - admin                           │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Pages & Components                        │
├─────────────────────────────────────────────────────┤
│ • student/FindTutor.jsx - Tìm kiếm gia sư          │
│ • student/TutorCard.jsx - Thẻ thông tin gia sư     │
│ • student/TutorCardSkeleton.jsx - Loading skeleton  │
│ • tutor/Profile.jsx - Hồ sơ gia sư                 │
│ • tutor/Dashboard.jsx - Dashboard gia sư            │
│ • admin/Verifications.jsx - Xác minh gia sư (admin) │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: Tìm kiếm gia sư, hiển thị chi tiết, xác minh

---

#### **8. Reviews (ReviewsController) ↔ Reviews & Ratings**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: ReviewsController                          │
├─────────────────────────────────────────────────────┤
│ GET /api/reviews                                    │
│ GET /api/reviews/{id}                               │
│ POST /api/reviews                                   │
│ PUT /api/reviews/{id}                               │
│ DELETE /api/reviews/{id}                            │
│ GET /api/reviews/tutor/{tutorId}                    │
│ GET /api/reviews/average/{tutorId}                  │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: reviewService.js (cần tạo)               │
├─────────────────────────────────────────────────────┤
│ • getReviews()                                      │
│ • getTutorReviews(tutorId)                          │
│ • createReview(reviewData)                          │
│ • updateReview(id, reviewData)                      │
│ • deleteReview(id)                                  │
│ • getAverageRating(tutorId)                         │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Pages & Components                        │
├─────────────────────────────────────────────────────┤
│ • student/FindTutor.jsx - Xem review gia sư        │
│ • student/Profile.jsx - Viết review sau lớp        │
│ • tutor/Dashboard.jsx - Xem review nhận được        │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: CRUD review, tính rating trung bình

---

#### **9. Payments (PaymentsController) ↔ Payment Processing**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: PaymentsController                         │
├─────────────────────────────────────────────────────┤
│ GET /api/payments                                   │
│ GET /api/payments/{id}                              │
│ POST /api/payments                                  │
│ PUT /api/payments/{id}                              │
│ POST /api/payments/{id}/refund                      │
│ GET /api/payments/user/{userId}                     │
│ POST /api/payments/check-status                     │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: paymentService.js (hoặc transactionService)
├─────────────────────────────────────────────────────┤
│ • getPayments()                                     │
│ • getUserPayments(userId)                           │
│ • createPayment(paymentData)                        │
│ • refundPayment(id)                                 │
│ • checkPaymentStatus(id)                            │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Pages                                     │
├─────────────────────────────────────────────────────┤
│ • tutor/Finance.jsx - Xem doanh thu                │
│ • student/Schedule.jsx - Thanh toán lớp            │
│ • admin/Transactions.jsx - Xem tất cả giao dịch    │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: Tạo/hoàn lại thanh toán, theo dõi giao dịch

---

#### **10. Messages (MessagesController) ↔ Messaging System**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: MessagesController                         │
├─────────────────────────────────────────────────────┤
│ GET /api/messages                                   │
│ GET /api/messages/{id}                              │
│ POST /api/messages                                  │
│ PUT /api/messages/{id}                              │
│ DELETE /api/messages/{id}                           │
│ GET /api/messages/conversation/{userId}             │
│ PUT /api/messages/{id}/read                         │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: messageService.js (cần tạo)              │
├─────────────────────────────────────────────────────┤
│ • getMessages()                                     │
│ • getConversation(userId)                           │
│ • sendMessage(messageData)                          │
│ • updateMessage(id, messageData)                    │
│ • deleteMessage(id)                                 │
│ • markAsRead(id)                                    │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Pages (cần tạo)                           │
├─────────────────────────────────────────────────────┤
│ • student/Messages.jsx - Trò chuyện với gia sư     │
│ • tutor/Messages.jsx - Trò chuyện với học viên      │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: Gửi/nhận tin nhắn, quản lý hội thoại

---

#### **11. Notifications (NotificationsController) ↔ Notification System**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: NotificationsController                    │
├─────────────────────────────────────────────────────┤
│ GET /api/notifications                              │
│ GET /api/notifications/{id}                         │
│ POST /api/notifications                             │
│ PUT /api/notifications/{id}                         │
│ DELETE /api/notifications/{id}                      │
│ PUT /api/notifications/{id}/mark-read               │
│ GET /api/notifications/user/{userId}                │
│ DELETE /api/notifications/user/{userId}/clear-all   │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: notificationService.js (cần tạo)         │
├─────────────────────────────────────────────────────┤
│ • getNotifications()                                │
│ • getUserNotifications(userId)                      │
│ • markAsRead(id)                                    │
│ • clearAllNotifications(userId)                     │
│ • deleteNotification(id)                            │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Components & Pages                        │
├─────────────────────────────────────────────────────┤
│ • Topbar/Sidebar (Bell icon) - Hiển thị thông báo │
│ • Notification dropdown - Danh sách thông báo       │
│ • Dashboard pages - Thông báo in-app                │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: Tạo/xóa thông báo, đánh dấu đã đọc

---

#### **12. Dashboard (DashboardController) ↔ Dashboard Pages**

```
┌─────────────────────────────────────────────────────┐
│ BACKEND: DashboardController                        │
├─────────────────────────────────────────────────────┤
│ GET /api/dashboard/admin/stats                      │
│ GET /api/dashboard/admin/recent-transactions        │
│ GET /api/dashboard/student/stats                    │
│ GET /api/dashboard/tutor/stats                      │
│ GET /api/dashboard/tutor/earnings                   │
│ GET /api/dashboard/tutor/recent-bookings            │
│ GET /api/dashboard/charts/data                      │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: dashboardService.js                       │
├─────────────────────────────────────────────────────┤
│ • getAdminStats()                                   │
│ • getStudentStats()                                 │
│ • getTutorStats()                                   │
│ • getTutorEarnings()                                │
│ • getRecentTransactions()                           │
│ • getChartData()                                    │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│ FRONTEND: Pages                                     │
├─────────────────────────────────────────────────────┤
│ • admin/AdminDashboard.jsx - Thống kê admin       │
│ • student/StudentDashboard.jsx - Thống kê học viên│
│ • tutor/Dashboard.jsx - Thống kê gia sư            │
└─────────────────────────────────────────────────────┘
```

**Chức năng**: Hiển thị thống kê, biểu đồ, dữ liệu phân tích

---

## �💾 Cơ sở dữ liệu

### Mô hình Entity-Relationship

```
┌─────────────────┐
│      USER       │
├─────────────────┤
│ * Id            │
│ * Email         │
│ * PasswordHash  │
│ * FullName      │
│ * Role          │
│ * Balance       │
│ * IsActivated   │
└────────┬────────┘
         │
    ┌────┴─────┐
    │           │
┌───▼────┐  ┌───▼────┐
│STUDENT │  │ TUTOR  │
├────────┤  ├────────┤
│School  │  │Subjects│
└────────┘  └────────┘

┌────────────────────────────────────┐
│ BOOKING (Student-Tutor)            │
├────────────────────────────────────┤
│ * StudentId → FK User              │
│ * TutorId → FK User                │
│ * ClassId → FK Class               │
│ * Status (Pending, Confirmed, etc) │
│ * BookingDate                      │
└────────────────────────────────────┘

┌────────────────┐     ┌──────────────┐
│ CLASS          │     │ SUBJECT      │
├────────────────┤     ├──────────────┤
│ * Id           │     │ * Id         │
│ * Name         │     │ * Name       │
│ * Type         │     │ * Description│
│ * TutorId (FK) │────▶│ * (etc)      │
└────────────────┘     └──────────────┘

┌──────────────────────┐
│ REVIEW               │
├──────────────────────┤
│ * StudentId (FK)     │
│ * TutorId (FK)       │
│ * Rating             │
│ * Comment            │
└──────────────────────┘

┌────────────────────┐
│ MESSAGE            │
├────────────────────┤
│ * SenderId (FK)    │
│ * ReceiverId (FK)  │
│ * Content          │
│ * CreatedAt        │
└────────────────────┘

┌────────────────────────┐
│ PAYMENT / TRANSACTION  │
├────────────────────────┤
│ * Id                   │
│ * UserId (FK)          │
│ * Amount               │
│ * Type (Deposit/etc)   │
│ * Status               │
│ * CreatedAt            │
└────────────────────────┘

┌──────────────────┐
│ NOTIFICATION     │
├──────────────────┤
│ * UserId (FK)    │
│ * Title          │
│ * Message        │
│ * IsRead         │
│ * CreatedAt      │
└──────────────────┘
```

### Các Bảng Chính

| Bảng | Mục đích |
|------|---------|
| **Users** | Lưu trữ tất cả người dùng (Admin, Student, Tutor) |
| **Students** | Thông tin học viên (mở rộng từ Users) |
| **Tutors** | Thông tin gia sư (mở rộng từ Users) |
| **Classes** | Lớp học được tạo bởi gia sư |
| **Subjects** | Danh sách môn học |
| **Bookings** | Lịch đặt lớp học (Student-Tutor) |
| **Reviews** | Đánh giá & rating |
| **Payments/Transactions** | Ghi nhận thanh toán & giao dịch tài chính |
| **Messages** | Tin nhắn giữa người dùng |
| **Notifications** | Thông báo hệ thống |

---

## 🚀 Tóm tắt Chức năng

### Tính năng chính

✅ **Xác thực & Phân quyền**
- Đăng ký/Đăng nhập
- JWT token-based authentication
- 3 roles: Admin, Student, Tutor

✅ **Quản lý Gia sư**
- Tạo & cập nhật hồ sơ gia sư
- Danh sách môn học
- Quản lý lớp học

✅ **Tìm kiếm & Đặt lịch**
- Tìm kiếm gia sư
- Xem chi tiết gia sư
- Tạo booking

✅ **Hệ thống Thanh toán**
- Xử lý thanh toán
- Lịch sử giao dịch
- Quản lý balance

✅ **Giao tiếp**
- Tin nhắn giữa học viên-gia sư
- Thông báo hệ thống
- Notifications dashboard

✅ **Đánh giá & Review**
- Học viên đánh giá gia sư
- Hệ thống rating
- Feedback management

✅ **Dashboard & Analytics**
- Admin dashboard (tổng quan hệ thống)
- Student dashboard (bookings, tutors)
- Tutor dashboard (classes, students, earnings)

---

## 📞 API Base URL

```
Development: http://localhost:5000/api
Production: https://api.tutorplatform.com/api
```

---

## 🔐 Xác thực

Các API request yêu cầu JWT token trong header:

```
Authorization: Bearer <jwt_token>
```

---

## 📝 Ghi chú

- Mỗi entity trong database có timestamp (CreatedAt, UpdatedAt)
- Password được hash bằng BCrypt
- JWT tokens có expiration time (cấu hình trong appsettings.json)
- Paginated responses sử dụng `PaginationResponse`

---

**Ngày tạo**: 30/04/2026  
**Phiên bản**: 1.0
