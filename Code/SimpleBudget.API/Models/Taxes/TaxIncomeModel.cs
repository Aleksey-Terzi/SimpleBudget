namespace SimpleBudget.API.Models
{
    public class TaxIncomeModel
    {
        public int PaymentId { get; set; }
        public string PaymentDate { get; set; } = default!;
        public string? CompanyName { get; set; }
        public string? Description { get; set; }
        public string? CategoryName { get; set; }
        public string WalletName { get; set; } = default!;
        public string CurrencyCode { get; set; } = default!;
        public decimal Rate { get; set; }
        public decimal Value { get; set; }
        public string ValueFormat { get; set; } = default!;
    }
}
