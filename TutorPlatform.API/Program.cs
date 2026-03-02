using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;

var builder = WebApplication.CreateBuilder(args);

// ============================================
// ADD SERVICES TO THE CONTAINER
// ============================================

// Controllers
builder.Services.AddControllers();

// ============================================
// DATABASE CONTEXT - QUAN TRỌNG!
// ============================================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// ============================================
// SWAGGER/OPENAPI
// ============================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ============================================
// CORS (cho React frontend)
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
var app = builder.Build();

// ============================================
// CONFIGURE HTTP REQUEST PIPELINE
// ============================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS
app.UseCors("AllowReactApp");

app.UseAuthentication(); // Sẽ cần sau khi setup JWT
app.UseAuthorization();

app.MapControllers();

app.Run();