using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class WalletEditModel
    {
        public int? PersonId { get; set; }

        [Required]
        public int CurrencyId { get; set; }

        [Required]
        public string WalletName { get; set; } = default!;

        public int PaymentCount { get; set; }

        public string? PersonName { get; set; }

        public string? CurrencyCode { get; set; }
    }
}
