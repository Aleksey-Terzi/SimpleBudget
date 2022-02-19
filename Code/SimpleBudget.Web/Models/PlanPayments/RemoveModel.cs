using System.Web;

namespace SimpleBudget.Web.Models.PlanPayments
{
    public class RemoveModel
    {
        public int Id { get; set; }
        public string? Type { get; set; }
        public string? Text { get; set; }
        public string? TextEncoded => HttpUtility.UrlEncode(Text);

        public bool IsActive { get; set; }
        public string PaymentType { get; set; } = default!;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Company { get; set; }
        public string? Category { get; set; }
        public string Wallet { get; set; } = default!;
        public string? Description { get; set; }
        public string Value { get; set; } = default!;
        public string? WalletTo { get; set; }
        public string? ValueTo { get; set; }

        public string FormattedPaymentDateRange => EndDate.HasValue
            ? $"{StartDate:MMM d, yyyy} - {EndDate:MMM d, yyyy}"
            : $"{StartDate:MMM d, yyyy}";
    }
}
