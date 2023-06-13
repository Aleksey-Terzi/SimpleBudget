using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class CurrencyRateEditModel
    {
        [Required]
        public string StartDate { get; set; } = default!;

        [Required]
        public decimal Rate { get; set; }

        [Required]
        public bool BankOfCanada { get; set; }
    }
}
