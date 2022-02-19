using System.Web;

namespace SimpleBudget.Web.Models.Reports
{
    public class MonthlyModel
    {
        public class MonthItem
        {
            public int Number { get; set; }
            public string Name { get; set; } = default!;
        }

        public class WalletItem
        {
            public string WalletName { get; set; } = default!;
            public string CurrencyCode { get; set; } = default!;
            public string ValueFormat { get; set; } = default!;
            public string ValueFormatCAD { get; set; } = default!;
            public decimal Beginning { get; set; }
            public decimal Expenses { get; set; }
            public decimal Income { get; set; }
            public decimal BeginningRate { get; set; }
            public decimal CurrentRate { get; set; }

            public string FormattedBeginning => string.Format(ValueFormat, Math.Abs(Beginning));
            public string FormattedBeginningCAD => FormatValue(ValueFormatCAD, BeginningRate * Beginning);
            public string FormattedCurrent => string.Format(ValueFormat, Math.Abs(Beginning + Income - Expenses));
            public string FormattedCurrentCAD => FormatValue(ValueFormatCAD, CurrentRate * (Beginning + Income - Expenses));
            public string FormattedDiffCAD => FormatValue(ValueFormatCAD, CurrentRate * (Beginning + Income - Expenses) - BeginningRate * Beginning);
            public string FormattedBeginningRate => $"{BeginningRate:####0.0000}";
            public string FormattedCurrentRate => $"{CurrentRate:####0.0000}";
        }

        public class CategoryItem
        {
            public string CategoryName { get; set; } = default!;
            public string ValueFormat { get; set; } = default!;
            public decimal Month { get; set; }
            public decimal Plan { get; set; }
            public decimal Need => Plan < Month ? 0 : Month - Plan;
            public decimal Week { get; set; }

            public string FormattedMonth => string.Format(ValueFormat, Month);
            public string FormattedPlan => string.Format(ValueFormat, Plan);
            public string FormattedNeed => FormatValue(ValueFormat, Need);
            public string FormattedWeek => string.Format(ValueFormat, Week);
        }

        public class Summary
        {
            public string Name { get; set; } = default!;
            public string ValueFormat { get; set; } = default!;
            public decimal Beginning { get; set; }
            public decimal Current { get; set; }

            public decimal Diff => Current - Beginning;

            public string FormattedBeginning => FormatValue(ValueFormat, Beginning);
            public string FormattedCurrent => FormatValue(ValueFormat, Current);
            public string FormattedDiff => FormatValue(ValueFormat, Diff);
        }

        public int SelectedYear { get; set; }
        public int SelectedMonth { get; set; }
        public bool DeductUnpaidTaxes { get; set; }
        public string ValueFormat { get; set; } = default!;
        public bool ShowWeekly { get; set; }

        public List<WalletItem> Wallets { get; set; } = default!;
        public List<CategoryItem> Categories { get; set; } = default!;
        public List<Summary> Summaries { get; set; } = default!;
        public List<int> Years { get; set; } = default!;
        public List<MonthItem> Months { get; set; } = default!;

        public string FormattedTotalCategoryMonth => string.Format(ValueFormat, Categories.Count > 0 ? Categories.Sum(x => x.Month) : 0);
        public string FormattedTotalCategoryPlan => string.Format(ValueFormat, Categories.Count > 0 ? Categories.Sum(x => x.Plan) : 0);
        public string FormattedTotalCategoryNeed => FormatValue(ValueFormat, Categories.Count > 0 ? Categories.Sum(x => x.Need) : 0);
        public string FormattedTotalCategoryWeek => string.Format(ValueFormat, Categories.Count > 0 ? Categories.Sum(x => x.Week) : 0);

        public string FormattedTotalWalletBeginning => FormatValue(ValueFormat, Wallets.Count > 0 ? Wallets.Sum(x => x.Beginning * x.BeginningRate) : 0);
        public string FormattedTotalWalletCurrent => FormatValue(ValueFormat, Wallets.Count > 0 ? Wallets.Sum(x => x.CurrentRate * (x.Beginning + x.Income - x.Expenses)) : 0);
        public string FormattedTotalWalletDiff => FormatValue(ValueFormat, Wallets.Count > 0 ? Wallets.Sum(x => x.CurrentRate * (x.Beginning + x.Income - x.Expenses)) - Wallets.Sum(x => x.Beginning * x.BeginningRate) : 0);

        public string FormattedTotalSummaryBeginning => FormatValue(ValueFormat, Summaries.Sum(x => x.Beginning));
        public string FormattedTotalSummaryCurrent => FormatValue(ValueFormat, Summaries.Sum(x => x.Current));
        public string FormattedTotalSummaryDiff => FormatValue(ValueFormat, Summaries.Sum(x => x.Diff));

        public string GetPaymentUrl(CategoryItem category)
        {
            var text = HttpUtility.UrlEncode($"year:{SelectedYear} month:{SelectedMonth} category:\"{category.CategoryName}\"");
            return $"/payments/?type=expenses&text={text}";
        }

        private static string FormatValue(string valueFormat, decimal value)
        {
            var text = string.Format(valueFormat, Math.Abs(value));

            if (value == 0)
                return text;

            return value > 0 ? $"<span style='color:green;'>{text}</span>" : $"<span style='color:red;'>{text}</span>";
        }
    }
}
