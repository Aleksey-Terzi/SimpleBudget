namespace SimpleBudget.API.Models
{
    public class SummaryWalletModel
    {
        public string WalletName { get; set; } = default!;
        public string CurrencyCode { get; set; } = default!;
        public decimal ValueCAD { get; set; }
        public string FormattedRate { get; set; } = default!;
        public string FormattedValue { get; set; } = default!;
        public string FormattedValueCAD { get; set; } = default!;
    }
}
