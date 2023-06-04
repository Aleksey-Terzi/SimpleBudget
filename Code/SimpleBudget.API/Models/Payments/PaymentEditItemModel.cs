using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class PaymentEditItemModel
    {
        [Required]
        public string PaymentType { get; set; } = default!;

        [Required]
        public string Date { get; set; } = default!;

        public string? Company { get; set; }

        public string? Category { get; set; }

        [Required]
        public string Wallet { get; set; } = default!;

        public string? Description { get; set; }

        [Required]
        public decimal Value { get; set; }

        public bool Taxable { get; set; }

        public int? TaxYear { get; set; }

        public string? WalletTo { get; set; }

        public decimal? ValueTo { get; set; }

        public string? Person { get; set; }
    }
}
