namespace SimpleBudget.API.Models
{
    public class PlanPaymentGridItemModel
    {
        public int PlanPaymentId { get; set; }
        public string? CompanyName { get; set; }
        public string? Description { get; set; }
        public string? CategoryName { get; set; }
        public string? WalletName { get; set; }
        public string? PersonName { get; set; }
        public decimal Value { get; set; }
        public bool Taxable { get; set; }
        public int? TaxYear { get; set; }
        public bool IsActive { get; set; }
        public bool IsActiveAndInDate { get; set; }

        public string FormattedValue { get; set; } = default!;
        public string FormattedPaymentDateRange { get; set; } = default!;
    }
}
