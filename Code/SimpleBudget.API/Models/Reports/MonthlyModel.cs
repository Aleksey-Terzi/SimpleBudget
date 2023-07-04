namespace SimpleBudget.API.Models
{
    public class MonthlyModel
    {
        public int SelectedYear { get; set; }
        public int SelectedMonth { get; set; }
        public bool ShowWeekly { get; set; }

        public List<MonthlyWalletModel> Wallets { get; set; } = default!;
        public List<MonthlyCategoryModel> Categories { get; set; } = default!;
        public List<MonthlySummaryModel> Summaries { get; set; } = default!;
        public List<int> Years { get; set; } = default!;
        public List<string> MonthNames { get; set; } = default!;

        public string ValueFormatCAD { get; set; } = default!;
    }
}
