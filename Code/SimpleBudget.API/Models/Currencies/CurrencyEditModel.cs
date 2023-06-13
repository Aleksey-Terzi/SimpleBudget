using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class CurrencyEditModel
    {
        [Required]
        public string Code { get; set; } = default!;

        [Required]
        public string ValueFormat { get; set; } = default!;

        public int WalletCount { get; set; }
    }
}
