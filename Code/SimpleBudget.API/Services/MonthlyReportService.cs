using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class MonthlyReportService
    {
        private readonly UnpaidTaxService _unpaidTaxService;
        private readonly ReportSearch _reportSearch;
        private readonly CurrencySearch _currencySearch;
        private readonly PlanPaymentSearch _planPaymentSearch;
        private readonly CategorySearch _categorySearch;
        private readonly WalletSearch _walletSearch;

        public MonthlyReportService(
            UnpaidTaxService unpaidTaxService,
            ReportSearch reportSearch,
            CurrencySearch currencySearch,
            PlanPaymentSearch planPaymentSearch,
            CategorySearch categorySearch,
            WalletSearch walletSearch
            )
        {
            _unpaidTaxService = unpaidTaxService;
            _reportSearch = reportSearch;
            _currencySearch = currencySearch;
            _planPaymentSearch = planPaymentSearch;
            _categorySearch = categorySearch;
            _walletSearch = walletSearch;
        }

        public async Task<MonthlyModel> CreateAsync(int accountId, int? year, int? month)
        {
            var cad = await _currencySearch.SelectFirst(x => x.AccountId == accountId && x.Code == "CAD");

            if (cad == null)
                throw new ArgumentException($"CAD currency is not found");

            var now = TimeHelper.GetLocalTime();

            var model = new MonthlyModel
            {
                SelectedYear = year ?? now.Year,
                SelectedMonth = month ?? now.Month,
                Years = new List<int>(),
                MonthNames = new List<string>()
            };

            for (int i = 2020; i <= now.Year; i++)
                model.Years.Add(i);

            for (int i = 1; i <= 12; i++)
                model.MonthNames.Add($"{new DateTime(2020, i, 1):MMMM}");

            await AddReportMonthlyAsync(accountId, model, cad.ValueFormat);
            await AddReportWeeklyAsync(accountId, model);
            await AddReportPlanAsync(accountId, model);
            await AddReportMonthlySummaryAsync(accountId, model, cad.ValueFormat);
            await AddTaxReportMonthlyWalletItem(accountId, model, cad.ValueFormat);

            CalculateTotals(model, cad.ValueFormat);

            return model;
        }

        private void CalculateTotals(MonthlyModel model, string valueFormatCAD)
        {
            model.Categories.Sort((a, b) => a.CategoryName.CompareTo(b.CategoryName));

            foreach (var category in model.Categories)
            {
                category.NeedCAD = category.PlanCAD < category.MonthCAD ? 0 : category.MonthCAD - category.PlanCAD;
                category.FormattedMonthCAD = string.Format(valueFormatCAD, category.MonthCAD);
                category.FormattedPlanCAD = string.Format(valueFormatCAD, category.PlanCAD);
                category.FormattedNeedCAD = string.Format(valueFormatCAD, -category.NeedCAD);
                category.FormattedWeekCAD = string.Format(valueFormatCAD, category.WeekCAD);
            }

            model.FormattedTotalCategoryMonthCAD = string.Format(valueFormatCAD, model.Categories.Count > 0 ? model.Categories.Sum(x => x.MonthCAD) : 0);
            model.FormattedTotalCategoryPlanCAD = string.Format(valueFormatCAD, model.Categories.Count > 0 ? model.Categories.Sum(x => x.PlanCAD) : 0);
            model.FormattedTotalCategoryNeedCAD = string.Format(valueFormatCAD, model.Categories.Count > 0 ? -model.Categories.Sum(x => x.NeedCAD) : 0);
            model.FormattedTotalCategoryWeekCAD = string.Format(valueFormatCAD, model.Categories.Count > 0 ? model.Categories.Sum(x => x.WeekCAD) : 0);
            model.FormattedTotalWalletBeginningCAD = string.Format(valueFormatCAD, Math.Abs(model.Wallets.Count > 0 ? model.Wallets.Sum(x => x.BeginningCAD) : 0));
            model.FormattedTotalWalletCurrentCAD = string.Format(valueFormatCAD, Math.Abs(model.Wallets.Count > 0 ? model.Wallets.Sum(x => x.CurrentCAD) : 0));
            model.FormattedTotalWalletDiffCAD = string.Format(valueFormatCAD, Math.Abs(model.Wallets.Count > 0 ? model.Wallets.Sum(x => x.DiffCAD) : 0));
            model.FormattedTotalSummaryBeginningCAD = string.Format(valueFormatCAD, Math.Abs(model.Summaries.Sum(x => x.BeginningCAD)));
            model.FormattedTotalSummaryCurrentCAD = string.Format(valueFormatCAD, Math.Abs(model.Summaries.Sum(x => x.CurrentCAD)));
            model.FormattedTotalSummaryDiffCAD = string.Format(valueFormatCAD, Math.Abs(model.Summaries.Sum(x => x.DiffCAD)));
        }

        private async Task AddReportMonthlyAsync(int accountId, MonthlyModel model, string valueFormatCAD)
        {
            var data = await _reportSearch.SelectReportMonthly(accountId, model.SelectedYear, model.SelectedMonth);

            model.Wallets = data.Wallets.Select(x =>
            {
                var current = x.Beginning + x.Income + x.Expenses;
                var currentCAD = current * x.CurrentRate;
                var beginningCAD = x.Beginning * x.BeginningRate;
                var diffCAD = currentCAD - beginningCAD;

                return new MonthlyWalletModel
                {
                    WalletName = x.WalletName,
                    CurrencyCode = x.CurrencyCode,
                    BeginningCAD = x.Beginning * x.BeginningRate,
                    CurrentCAD = currentCAD,
                    DiffCAD = diffCAD,
                    FormattedBeginning = string.Format(x.ValueFormat, Math.Abs(x.Beginning)),
                    FormattedBeginningCAD = string.Format(valueFormatCAD, Math.Abs(beginningCAD)),
                    FormattedCurrent = string.Format(x.ValueFormat, Math.Abs(current)),
                    FormattedCurrentCAD = string.Format(valueFormatCAD, Math.Abs(currentCAD)),
                    FormattedDiffCAD = string.Format(valueFormatCAD, Math.Abs(diffCAD)),
                    FormattedBeginningRate = $"{x.BeginningRate:####0.0000}",
                    FormattedCurrentRate = $"{x.CurrentRate:####0.0000}"
                };
            }).ToList();

            model.Categories = data.Categories.Select(x => new MonthlyCategoryModel
            {
                CategoryName = x.CategoryName,
                MonthCAD = -x.Value
            }).ToList();
        }

        private async Task AddReportWeeklyAsync(int accountId, MonthlyModel model)
        {
            var now = DateTime.Today;

            model.ShowWeekly = model.SelectedYear == now.Year && model.SelectedMonth == now.Month;
            if (!model.ShowWeekly)
                return;

            var firstDay = now.DayOfWeek == DayOfWeek.Sunday
                ? now.AddDays(-6)
                : now.AddDays(1 - (int)now.DayOfWeek);

            var data = await _reportSearch.SelectReportWeekly(accountId, firstDay);

            foreach (var current in data)
            {
                var existing = model.Categories.Find(x => string.Equals(x.CategoryName, current.CategoryName, StringComparison.OrdinalIgnoreCase));

                if (existing != null)
                {
                    existing.WeekCAD = -current.Value;
                }
                else
                {
                    model.Categories.Add(new MonthlyCategoryModel
                    {
                        CategoryName = current.CategoryName,
                        WeekCAD = -current.Value,
                    });
                }
            }
        }

        private async Task AddReportPlanAsync(int accountId, MonthlyModel model)
        {
            var start = new DateTime(model.SelectedYear, model.SelectedMonth, 1);
            var end = start.AddMonths(1);

            var payments = (await _planPaymentSearch.GetPayments(accountId, start, end))
                .Where(x => x.Value < 0)
                .ToList();

            var categories = new Dictionary<int, string>();
            var rates = new Dictionary<int, decimal>();

            foreach (var payment in payments)
            {
                string? categoryName;

                if (payment.CategoryId == null)
                    categoryName = "[No Category]";
                else if (!categories.TryGetValue(payment.CategoryId.Value, out categoryName))
                {
                    var category = await _categorySearch.SelectFirst(x => x.CategoryId == payment.CategoryId);
                    if (category == null)
                        throw new ArgumentException($"Category with id = {payment.CategoryId} is not found");

                    categories.Add(payment.CategoryId.Value, categoryName = category.Name);
                }

                if (!rates.TryGetValue(payment.WalletId, out var rate))
                {
                    rate = await _walletSearch.BindFirst(x => x.Currency.CurrencyRates
                                                                    .Where(y => y.StartDate < end && !y.BankOfCanada)
                                                                    .OrderByDescending(y => y.StartDate)
                                                                    .Select(y => (decimal?)y.Rate)
                                                                    .FirstOrDefault() ?? 1m,
                        x => x.WalletId == payment.WalletId
                    );

                    rates.Add(payment.WalletId, rate);
                }

                var value = -rate * payment.Value;

                var existing = model.Categories.Find(x => string.Equals(x.CategoryName, categoryName, StringComparison.OrdinalIgnoreCase));

                if (existing != null)
                {
                    existing.PlanCAD += value;
                }
                else
                {
                    model.Categories.Add(new MonthlyCategoryModel
                    {
                        CategoryName = categoryName,
                        PlanCAD = value
                    });
                }
            }
        }

        private async Task AddReportMonthlySummaryAsync(int accountId, MonthlyModel model, string valueFormatCAD)
        {
            var summary = await _reportSearch.SelectReportMonthlySummary(accountId, model.SelectedYear, model.SelectedMonth);

            var diff = summary.Current - summary.Beginning;

            model.Summaries = new List<MonthlySummaryModel>
            {
                new MonthlySummaryModel
                {
                    Name = "All Wallets Total",
                    BeginningCAD = summary.Beginning,
                    CurrentCAD = summary.Current,
                    DiffCAD = diff,
                    FormattedBeginningCAD = string.Format(valueFormatCAD, Math.Abs(summary.Beginning)),
                    FormattedCurrentCAD = string.Format(valueFormatCAD, Math.Abs(summary.Current)),
                    FormattedDiffCAD = string.Format(valueFormatCAD, Math.Abs(diff)),
                }
            };
        }

        private async Task AddTaxReportMonthlyWalletItem(int accountId, MonthlyModel model, string valueFormatCAD)
        {
            var currentMonth = new DateTime(model.SelectedYear, model.SelectedMonth, 1);
            var lastMonth = currentMonth.AddMonths(-1);

            var current = - await _unpaidTaxService.CalculateUnpaidTaxAsync(accountId, currentMonth.Year, currentMonth.Month, currentMonth.AddMonths(1).AddDays(-1));
            var beginning = - await _unpaidTaxService.CalculateUnpaidTaxAsync(accountId, lastMonth.Year, lastMonth.Month, lastMonth.AddMonths(1).AddDays(-1));
            var diff = current - beginning;

            model.Summaries.Add(new MonthlySummaryModel
            {
                Name = "Unpaid Taxes",
                BeginningCAD = beginning,
                CurrentCAD = current,
                DiffCAD = diff,
                FormattedBeginningCAD = string.Format(valueFormatCAD, Math.Abs(beginning)),
                FormattedCurrentCAD = string.Format(valueFormatCAD, Math.Abs(current)),
                FormattedDiffCAD = string.Format(valueFormatCAD, Math.Abs(diff))
            });
        }
    }
}
