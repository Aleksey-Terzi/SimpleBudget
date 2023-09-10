using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class ProductEditModel
    {
        [Required]
        public string ProductName { get; set; } = default!;

        public string? CategoryName { get; set; }

        public int PriceCount { get; set; }
    }
}
