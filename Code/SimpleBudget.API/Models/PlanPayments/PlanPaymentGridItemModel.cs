namespace SimpleBudget.API.Models
{
    public class PlanPaymentGridItemModel
    {
        public int PlanPaymentId { get; set; }
        public string PaymentStartDate { get; set; } = default!;
        public string? PaymentEndDate { get; set; }
        public string? CompanyName { get; set; }
        public string? Description { get; set; }
        public string? CategoryName { get; set; }
        public string? WalletName { get; set; }
        public string? PersonName { get; set; }
        public string ValueFormat { get; set; } = default!;
        public decimal Value { get; set; }
        public bool Taxable { get; set; }
        public int? TaxYear { get; set; }
        public bool IsActive { get; set; }
        public bool IsActiveAndInDate { get; set; }
    }
}
