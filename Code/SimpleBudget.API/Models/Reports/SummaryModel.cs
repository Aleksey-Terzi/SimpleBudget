namespace SimpleBudget.API.Models
{
    public class SummaryModel
    {
        public List<SummaryWalletModel> Wallets { get; set; } = default!;
        public List<SummaryCurrencyModel> Currencies { get; set; } = default!;

        public string ValueFormatCAD { get; set; } = default!;
        public decimal TaxCAD { get; set; }
    }
}
