namespace SimpleBudget.API.Models
{
    public class SummaryWalletModel
    {
        public string WalletName { get; set; } = default!;
        public string CurrencyCode { get; set; } = default!;
        public string ValueFormat { get; set; } = default!;
        public decimal Value { get; set; }
        public decimal Rate { get; set; }
    }
}
