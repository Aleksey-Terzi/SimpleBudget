namespace SimpleBudget.API.Models
{
    public class ProductGridModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = default!;
        public string? CategoryName { get; set; }
        public int PriceCount { get; set; }
    }
}
