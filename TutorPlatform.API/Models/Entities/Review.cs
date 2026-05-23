using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TutorPlatform.API.Models.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public int? BookingId { get; set; } // buổi học (booking) được đánh giá
        public int StudentId { get; set; }//nguoi danh gia
        public int TutorId { get; set; }// nguoi duoc danh gia

        public int Rating { get; set; } = 5; 
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsVerified { get; set; } = false; 
        public Student Student { get; set; }
        public Tutor Tutor { get; set; }
        public Booking? Booking { get; set; }
    }
}
