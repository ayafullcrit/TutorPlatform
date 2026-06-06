using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Security.Claims;
using TutorPlatform.API.Data;
using TutorPlatform.API.Services.Helper;
using TutorPlatform.API.Services.Implementations;
using TutorPlatform.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ============================================
// ADD SERVICES TO THE CONTAINER
// ============================================

builder.Services.AddControllers();


// ============================================
// DATABASE CONTEXT
// ============================================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// ============================================
// DEPENDENCY INJECTION - SERVICES
// ============================================

// Helpers
builder.Services.AddScoped<JwtHelper>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ISubjectService, SubjectService>();  
builder.Services.AddScoped<IClassService, ClassService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<INotificationService, NotificationService>();


// ============================================
// JWT AUTHENTICATION
// ============================================

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // No tolerance for expired tokens
    };

    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = async context =>
        {
            var db = context.HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();
            var userIdStr = context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdStr, out int userId))
            {
                var isActive = await db.Users.Where(u => u.Id == userId).Select(u => u.IsActive).FirstOrDefaultAsync();
                if (!isActive)
                {
                    context.Fail("Tài khoản đã bị khóa");
                }
            }
        }
    };
});

// ============================================
// SWAGGER/OPENAPI WITH JWT
// ============================================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TutorPlatform API",
        Version = "v1",
        Description = "API for Tutor Platform"
    });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ============================================
// CORS
// ============================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ============================================
// BUILD APP
// ============================================
var testSecretKey = builder.Configuration["JwtSettings:SecretKey"];
Console.WriteLine($"DEBUG - SecretKey from config: {testSecretKey}");
Console.WriteLine($"DEBUG - SecretKey length: {testSecretKey?.Length}");

if (string.IsNullOrWhiteSpace(testSecretKey))
{
    Console.WriteLine("ERROR: JwtSettings:SecretKey is NULL or empty!");
    throw new Exception("JWT Configuration is missing!");
}
var app = builder.Build();

// ============================================
// APPLY MIGRATIONS
// ============================================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();

    await db.Database.ExecuteSqlRawAsync("""
        IF COL_LENGTH('Transactions', 'WithdrawalStatus') IS NULL
        BEGIN
            ALTER TABLE [Transactions]
            ADD [WithdrawalStatus] int NOT NULL CONSTRAINT [DF_Transactions_WithdrawalStatus] DEFAULT(0);
        END
    """);

    if (app.Environment.IsDevelopment())
    {
        await TutorPlatform.API.Data.SeedData.RuntimeAdminSeeder.EnsureAdminUserAsync(db);
    }
}

// ============================================
// CONFIGURE HTTP REQUEST PIPELINE
// ============================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors("AllowReactApp");

app.UseAuthentication();  // ← QUAN TRỌNG: Phải đứng trước UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();
