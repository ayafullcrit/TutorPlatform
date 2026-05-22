namespace TutorPlatform.API.Models.DTOs.Responses.Subject
{
    public class SubjectResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
     //   public string Icon { get; set; }
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
        public int TotalClasses { get; set; }
    }
}
