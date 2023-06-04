using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class PlanPaymentEditItemModel
    {
        public bool IsActive { get; set; }

        [Required]
        public string PaymentType { get; set; } = default!;

        [Required]
        public string StartDate { get; set; } = default!;

        public string? EndDate { get; set; }

        public string? Company { get; set; }

        public string? Category { get; set; }

        [Required]
        public string Wallet { get; set; } = default!;

        public string? Description { get; set; }

        [Required]
        public decimal Value { get; set; }

        public bool Taxable { get; set; }

        public int? TaxYear { get; set; }

        public string? Person { get; set; }
    }
}
