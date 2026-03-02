using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.Entities
{
    public class Class
    {
        public int Id { get; set; }
        
        [ForeignKey("Tutor")]
        public int TutorId { get; set; }
        
        [ForeignKey("Subject")]
        public int SubjectId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        //thoi gian     
        public decimal PricePerSession { get; set; }
        public int DurationInMinutes { get; set; }
        public DateTime StartTime { get; set; }
        public int TotalSessions { get; set; }
        public int CurrentStudents { get; set; } 
        public int MaxStudents { get; set; }
        public ClassStatus Status { get; set; }

        public Tutor Tutor { get; set; }
        public Subject Subject { get; set; }
        public ICollection<Booking> Bookings { get; set; }
    }
}