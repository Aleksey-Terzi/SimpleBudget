using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class ProductPriceMultiModel
    {
        public class PriceModel
        {
            [Required]
            public string ProductName { get; set; } = default!;

            [Required]
            public int Quantity { get; set; }

            [Required]
            public decimal Price { get; set; }

            [Required]
            public bool IsDiscount { get; set; }

            public string? Description { get; set; }
        }

        public string? CompanyName { get; set; }
        public string? CategoryName { get; set; }

        [Required]
        public string PriceDate { get; set; } = default!;

        [Required]
        public PriceModel[] Prices { get; set; } = default!;
    }
}
