namespace TutorPlatform.API.Models.DTOs.Responses
{
    public class PaginatedResponse<T>
    {       
        public List<T> Items { get; set; }
        public int CurrentPage { get; set; }               
        public int PageSize { get; set; }    
        public int TotalCount { get; set; }     
        public int TotalPages { get; set; }      
        public bool HasPrevious { get; set; }
        public bool HasNext { get; set; }
        public PaginatedResponse(List<T> items, int count, int pageNumber, int pageSize)
        {
            Items = items;
            TotalCount = count;
            CurrentPage = pageNumber;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            HasPrevious = pageNumber > 1;
            HasNext = pageNumber < TotalPages;
        }
    }
}