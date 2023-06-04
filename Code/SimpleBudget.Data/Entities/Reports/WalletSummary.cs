namespace SimpleBudget.Data
{
    public class WalletSummary
    {
        public string WalletName { get; set; } = default!;
        public string CurrencyCode { get; set; } = default!;
        public string ValueFormat { get; set; } = default!;
        public decimal Value { get; set; }
        public decimal Rate { get; set; }
    }
}
