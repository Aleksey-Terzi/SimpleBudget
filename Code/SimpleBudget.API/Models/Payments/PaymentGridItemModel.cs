namespace SimpleBudget.API.Models
{
    public class PaymentGridItemModel
    {
        public int PaymentId { get; set; }
        public string PaymentDate { get; set; } = default!;
        public string? CompanyName { get; set; }
        public string? Description { get; set; }
        public string? CategoryName { get; set; }
        public string? WalletName { get; set; }
        public string? PersonName { get; set; }
        public string ValueFormat { get; set; } = default!;
        public decimal Value { get; set; }
        public bool Taxable { get; set; }
        public int? TaxYear { get; set; }

        public PaymentGridItemModel? TransferTo { get; set; }
    }
}
