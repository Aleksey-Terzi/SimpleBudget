namespace SimpleBudget.API.Models
{
    public class ProductPriceGridModel
    {
        public int ProductPriceId { get; set; }
        public string ProductName { get; set; } = default!;
        public string? CompanyName { get; set; }
        public string? CategoryName { get; set; }
        public decimal Price { get; set; }
        public string PriceDate { get; set; } = default!;
        public bool IsDiscount { get; set; }
        public int? Quantity { get; set; }
        public string? Description { get; set; }
    }
}
