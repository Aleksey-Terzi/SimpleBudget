namespace SimpleBudget.API.Models
{
    public class MonthlyModel
    {
        public int SelectedYear { get; set; }
        public int SelectedMonth { get; set; }
        public bool ShowWeekly { get; set; }

        public string FormattedTotalCategoryMonthCAD { get; set; } = default!;
        public string FormattedTotalCategoryPlanCAD { get; set; } = default!;
        public string FormattedTotalCategoryNeedCAD { get; set; } = default!;
        public string FormattedTotalCategoryWeekCAD { get; set; } = default!;

        public string FormattedTotalWalletBeginningCAD { get; set; } = default!;
        public string FormattedTotalWalletCurrentCAD { get; set; } = default!;
        public string FormattedTotalWalletDiffCAD { get; set; } = default!;

        public string FormattedTotalSummaryBeginningCAD { get; set; } = default!;
        public string FormattedTotalSummaryCurrentCAD { get; set; } = default!;
        public string FormattedTotalSummaryDiffCAD { get; set; } = default!;

        public List<MonthlyWalletModel> Wallets { get; set; } = default!;
        public List<MonthlyCategoryModel> Categories { get; set; } = default!;
        public List<MonthlySummaryModel> Summaries { get; set; } = default!;
        public List<int> Years { get; set; } = default!;
        public List<string> MonthNames { get; set; } = default!;
    }
}
