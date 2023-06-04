namespace SimpleBudget.API.Models
{
    public class PaginationData
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public int PagesPerSection { get; set; }
    }
}
