namespace SimpleBudget.API.Models
{
    public class MonthlyWalletModel
    {
        public string WalletName { get; set; } = default!;
        public string CurrencyCode { get; set; } = default!;
        public string ValueFormat { get; set; } = default!;
        public decimal Beginning { get; set; }
        public decimal Current { get; set; }
        public decimal BeginningRate { get; set; }
        public decimal CurrentRate { get; set; }
    }
}
