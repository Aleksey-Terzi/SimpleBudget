using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class TaxRateModel
    {
        [Required]
        public decimal Rate { get; set; }

        [Required]
        public decimal MaxAmount { get; set; }
    }
}
