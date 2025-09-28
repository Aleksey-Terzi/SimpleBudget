using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class MonthlyReportService
    {
        private readonly IdentityService _identity;
        private readonly UnpaidTaxService _unpaidTaxService;
        private readonly ReportSearch _reportSearch;
        private readonly CurrencySearch _currencySearch;
        private readonly PlanPaymentSearch _planPaymentSearch;
        private readonly CategorySearch _categorySearch;
        private readonly WalletSearch _walletSearch;

        public MonthlyReportService(
            IdentityService identity,
            UnpaidTaxService unpaidTaxService,
            ReportSearch reportSearch,
            CurrencySearch currencySearch,
            PlanPaymentSearch planPaymentSearch,
            CategorySearch categorySearch,
            WalletSearch walletSearch
            )
        {
            _identity = identity;
            _unpaidTaxService = unpaidTaxService;
            _reportSearch = reportSearch;
            _currencySearch = currencySearch;
            _planPaymentSearch = planPaymentSearch;
            _categorySearch = categorySearch;
            _walletSearch = walletSearch;
        }

        public async Task<MonthlyModel> CreateAsync(int? year, int? month)
        {
            var cad = await _currencySearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.Code == "CAD");

            if (cad == null)
                throw new ArgumentException($"CAD currency is not found");

            var now = _identity.TimeHelper.GetLocalTime();

            var model = new MonthlyModel
            {
                SelectedYear = year ?? now.Year,
                SelectedMonth = month ?? now.Month,
                Years = new List<int>()
            };

            for (int i = now.Year; i >= 2020; i--)
                model.Years.Add(i);

            await AddReportMonthlyAsync(model, cad.ValueFormat);
            await AddReportWeeklyAsync(model);
            await AddReportPlanAsync(model);
            await AddReportMonthlySummaryAsync(model, cad.ValueFormat);
            await AddTaxReportMonthlyWalletItem(model, cad.ValueFormat);

            CalculateTotals(model, cad.ValueFormat);

            return model;
        }

        private void CalculateTotals(MonthlyModel model, string valueFormatCAD)
        {
            model.Categories.Sort((a, b) => a.CategoryName.CompareTo(b.CategoryName));

            foreach (var category in model.Categories)
                category.NeedCAD = category.PlanCAD < category.MonthCAD ? 0 : category.MonthCAD - category.PlanCAD;

            model.ValueFormatCAD = valueFormatCAD;
        }

        private async Task AddReportMonthlyAsync(MonthlyModel model, string valueFormatCAD)
        {
            var data = await _reportSearch.SelectReportMonthly(_identity.AccountId, model.SelectedYear, model.SelectedMonth);

            model.Wallets = data.Wallets.Select(x =>
            {
                var current = x.Beginning + x.Income + x.Expenses;

                return new MonthlyWalletModel
                {
                    WalletName = x.WalletName,
                    CurrencyCode = x.CurrencyCode,
                    ValueFormat = x.ValueFormat,
                    Beginning = x.Beginning,
                    Current = current,
                    BeginningRate = x.BeginningRate,
                    CurrentRate = x.CurrentRate,
                };
            }).ToList();

            model.Categories = data.Categories.Select(x => new MonthlyCategoryModel
            {
                CategoryName = x.CategoryName,
                MonthCAD = -x.Value
            }).ToList();
        }

        private async Task AddReportWeeklyAsync(MonthlyModel model)
        {
            var now = DateTime.Today;

            model.ShowWeekly = model.SelectedYear == now.Year && model.SelectedMonth == now.Month;
            if (!model.ShowWeekly)
                return;

            var firstDay = now.DayOfWeek == DayOfWeek.Sunday
                ? now.AddDays(-6)
                : now.AddDays(1 - (int)now.DayOfWeek);

            var data = await _reportSearch.SelectReportWeekly(_identity.AccountId, firstDay);

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

        private async Task AddReportPlanAsync(MonthlyModel model)
        {
            var start = new DateTime(model.SelectedYear, model.SelectedMonth, 1);
            var end = start.AddMonths(1);

            var payments = (await _planPaymentSearch.GetPayments(_identity.AccountId, start, end))
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
                    categoryName = await _categorySearch.GetAsync(x => x.Name, x => x.CategoryId == payment.CategoryId);
                    if (categoryName == null)
                        throw new ArgumentException($"Category with id = {payment.CategoryId} is not found");

                    categories.Add(payment.CategoryId.Value, categoryName);
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

        private async Task AddReportMonthlySummaryAsync(MonthlyModel model, string valueFormatCAD)
        {
            var summary = await _reportSearch.SelectReportMonthlySummary(_identity.AccountId, model.SelectedYear, model.SelectedMonth);

            model.Summaries = new List<MonthlySummaryModel>
            {
                new MonthlySummaryModel
                {
                    Name = "All Wallets Total",
                    BeginningCAD = summary.Beginning,
                    CurrentCAD = summary.Current,
                }
            };
        }

        private async Task AddTaxReportMonthlyWalletItem(MonthlyModel model, string valueFormatCAD)
        {
            var currentMonth = new DateTime(model.SelectedYear, model.SelectedMonth, 1);
            var lastMonth = currentMonth.AddMonths(-1);

            var current = - await _unpaidTaxService.CalculateUnpaidTaxAsync(currentMonth.Year, currentMonth.Month, currentMonth.AddMonths(1).AddDays(-1));
            var beginning = - await _unpaidTaxService.CalculateUnpaidTaxAsync(lastMonth.Year, lastMonth.Month, lastMonth.AddMonths(1).AddDays(-1));

            model.Summaries.Add(new MonthlySummaryModel
            {
                Name = "Unpaid Taxes",
                BeginningCAD = beginning,
                CurrentCAD = current,
            });
        }
    }
}
