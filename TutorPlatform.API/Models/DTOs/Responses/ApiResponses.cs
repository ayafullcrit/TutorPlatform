namespace TutorPlatform.API.Models.DTOs.Responses
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; } // Dữ liệu trả về, có thể là token hoặc thông tin người dùng
        public List<string> Errors { get; set; }//Danh sách lỗi (nếu có)
        public DateTime Timestamp { get; set; } // Thời gian trả về phản hồi
        public ApiResponse()
        {
            Timestamp = DateTime.UtcNow;
            Errors = new List<string>();
        }
        public ApiResponse(T data, string message = null)
        {
            Success = true;
            Data = data;
            Errors = new List<string>();
            Timestamp = DateTime.UtcNow;
            Message = message ?? "Success";
        }
        public ApiResponse(string messsage, List<string> errors = null)
        {
            Success = false;
            Errors = errors ?? new List<string>();
            Timestamp = DateTime.UtcNow;
            Message = messsage;
        }
    }
    public class ApiResponse : ApiResponse<object>
    {
        public ApiResponse() : base() { }

        public ApiResponse(string message, bool success = true)
        {
            Success = success;
            Message = message;
            Timestamp = DateTime.UtcNow;
            Errors = new List<string>();
        }
        public ApiResponse(string messsage, List<string> errors = null)
        {
            Success = false;
            Errors = errors ?? new List<string>();
            Timestamp = DateTime.UtcNow;
            Message = messsage;
        }
    }
}
