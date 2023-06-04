namespace SimpleBudget.API.Models
{
    public class TaxIncomeModel
    {
        public int PaymentId { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? CompanyName { get; set; }
        public string? Description { get; set; }
        public string? CategoryName { get; set; }
        public string WalletName { get; set; } = default!;
        public string CurrencyCode { get; set; } = default!;
        public decimal Rate { get; set; }
        public decimal ValueCAD { get; set; }

        public string FormattedPaymentDate { get; set; } = default!;
        public string FormattedValue { get; set; } = default!;
        public string FormattedValueCAD { get; set; } = default!;
        public string FormattedRate { get; set; } = default!;
    }
}
