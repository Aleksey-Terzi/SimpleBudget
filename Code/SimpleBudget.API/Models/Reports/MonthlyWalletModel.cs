namespace SimpleBudget.API.Models
{
    public class MonthlyWalletModel
    {
        public string WalletName { get; set; } = default!;
        public string CurrencyCode { get; set; } = default!;
        public decimal BeginningCAD { get; set; }
        public decimal CurrentCAD { get; set; }
        public decimal DiffCAD { get; set; }

        public string FormattedBeginning { get; set; } = default!;
        public string FormattedBeginningCAD { get; set; } = default!;
        public string FormattedCurrent { get; set; } = default!;
        public string FormattedCurrentCAD { get; set; } = default!;
        public string FormattedDiffCAD { get; set; } = default!;
        public string FormattedBeginningRate { get; set; } = default!;
        public string FormattedCurrentRate { get; set; } = default!;
    }
}
