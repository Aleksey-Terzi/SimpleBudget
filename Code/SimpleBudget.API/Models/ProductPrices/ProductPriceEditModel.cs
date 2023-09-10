using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class ProductPriceEditModel
    {
        [Required]
        public string ProductName { get; set; } = default!;

        public string? CompanyName { get; set; } = default!;

        public string? CategoryName { get; set; }

        [Required]
        public string PriceDate { get; set; } = default!;

        [Required]
        public decimal Price { get; set; }

        [Required]
        public bool IsDiscount { get; set; }

        public int? Quantity { get; set; }

        public string? Description { get; set; }
    }
}
