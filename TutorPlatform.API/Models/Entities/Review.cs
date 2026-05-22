using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TutorPlatform.API.Models.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public int StudentId { get; set; }//nguoi danh gia
        public int TutorId { get; set; }// nguoi duoc danh gia

        public int Rating { get; set; } 
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsVerified { get; set; } 
        public Student Student { get; set; }
        public Tutor Tutor { get; set; }
    }
}