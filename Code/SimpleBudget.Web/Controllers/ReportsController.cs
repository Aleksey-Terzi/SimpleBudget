using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.Data;
using SimpleBudget.Web.Models.Reports;

namespace SimpleBudget.Web.Controllers
{
    [Authorize]
    public class ReportsController : BaseController
    {
        public IActionResult Summary(int? deduct)
        {
            ViewData["menu"] = WebConstants.MenuActions.Summary;

            var data = Searches.Report.SelectWalletSummary(AccountId);
            var cad = Searches.Currency.SelectFirst(x => x.AccountId == AccountId && x.Code == "CAD");

            if (cad == null)
                throw new ArgumentException($"CAD currency is not found");

            var model = new SummaryModel
            {
                DeductUnpaidTaxes = deduct != 0,
                ValueFormatCAD = cad.ValueFormat
            };

            model.WalletItems = data.Select(x => new SummaryModel.WalletItem
            {
                WalletName = x.WalletName,
                CurrencyCode = x.CurrencyCode,
                ValueFormat = x.ValueFormat,
                Value = x.Value,
                Rate = x.Rate,
                ValueFormatCAD = cad.ValueFormat
            }).ToList();

            model.CurrencyItems = data
                .GroupBy(x => new { x.CurrencyCode, x.ValueFormat, x.Rate })
                .Select(x => new SummaryModel.CurrencyItem
                {
                    CurrencyCode = x.Key.CurrencyCode,
                    ValueFormat = x.Key.ValueFormat,
                    Value = x.Sum(y => y.Value),
                    Rate = x.Key.Rate,
                    ValueFormatCAD = cad.ValueFormat
                }).ToList();

            if (model.DeductUnpaidTaxes)
                model.Tax = CalculateUnpaidTax(TimeHelper.GetLocalTime().Year, null, null);

            return View(model);
        }

        public IActionResult Tax(int? personId, int? year)
        {
            ViewData["menu"] = WebConstants.MenuActions.Taxes;

            var model = TaxModelHelper.CreateModel(AccountId, personId, year, null, null);
            model.Closed = Searches.TaxYear.SelectFirst(x => x.PersonId == model.SelectedPersonId && x.Year == model.SelectedYear)?.Closed;
            return View(model);
        }

        [HttpPost]
        [ActionName("tax")]
        public IActionResult TaxPost(int? personId, int? year)
        {
            ViewData["menu"] = WebConstants.MenuActions.Taxes;

            var model = TaxModelHelper.CreateModel(AccountId, personId, year, null, null);

            if (model.SelectedPersonId.HasValue)
            {
                var taxYearEntity = Searches.TaxYear.SelectFirst(x => x.PersonId == model.SelectedPersonId && x.Year == model.SelectedYear);

                if (taxYearEntity == null)
                {
                    var lastTaxPayment = Searches.Payment.Select(
                        x =>
                            x.PersonId == model.SelectedPersonId
                            && x.TaxYear == model.SelectedYear
                            && x.Category.Name == Constants.Category.Taxes,
                        q => q.OrderBy(x => x.PaymentDate)
                    ).FirstOrDefault();

                    var closed = lastTaxPayment != null && lastTaxPayment.PaymentDate.Year > model.SelectedYear
                        ? lastTaxPayment.PaymentDate
                        : new DateTime(model.SelectedYear, 1, 1);

                    taxYearEntity = new TaxYear
                    {
                        Year = model.SelectedYear,
                        PersonId = model.SelectedPersonId.Value,
                        FinalTaxAmount = model.TaxPaidTotal,
                        Closed = closed
                    };

                    Stores.TaxYear.Insert(taxYearEntity);
                }
                else
                {
                    Stores.TaxYear.Delete(taxYearEntity);
                }
            }

            model.Closed = Searches.TaxYear.SelectFirst(x => x.PersonId == model.SelectedPersonId && x.Year == model.SelectedYear)?.Closed;

            return View(model);
        }

        public IActionResult Monthly(int? year, int? month, int? deduct)
        {
            ViewData["menu"] = WebConstants.MenuActions.MonthlyReport;

            var cad = Searches.Currency.SelectFirst(x => x.AccountId == AccountId && x.Code == "CAD");

            if (cad == null)
                throw new ArgumentException($"CAD currency is not found");

            var now = TimeHelper.GetLocalTime();

            var model = new MonthlyModel
            {
                SelectedYear = year ?? now.Year,
                SelectedMonth = month ?? now.Month,
                DeductUnpaidTaxes = deduct != 0,
                ValueFormat = cad.ValueFormat
            };

            model.Years = new List<int>();
            for (int i = 2020; i <= now.Year; i++)
                model.Years.Add(i);

            model.Months = new List<MonthlyModel.MonthItem>();
            for (int i = 1; i <= 12; i++)
                model.Months.Add(new MonthlyModel.MonthItem { Number = i, Name = $"{new DateTime(2020, i, 1):MMMM}" });

            AddReportMonthly(model);
            AddReportWeekly(model);
            AddReportPlan(model);

            model.Categories.Sort((a, b) => a.CategoryName.CompareTo(b.CategoryName));

            AddReportMonthlySummary(model);

            if (model.DeductUnpaidTaxes)
                AddTaxReportMonthlyWalletItem(model);

            return View(model);
        }

        private void AddReportMonthly(MonthlyModel model)
        {
            var data = Searches.Report.SelectReportMonthly(AccountId, model.SelectedYear, model.SelectedMonth);

            model.Wallets = data.Wallets.Select(x => new MonthlyModel.WalletItem
            {
                WalletName = x.WalletName,
                CurrencyCode = x.CurrencyCode,
                ValueFormat = x.ValueFormat,
                ValueFormatCAD = model.ValueFormat,
                Beginning = x.Beginning,
                Expenses = -x.Expenses,
                Income = x.Income,
                BeginningRate = x.BeginningRate,
                CurrentRate = x.CurrentRate
            }).ToList();

            model.Categories = data.Categories.Select(x => new MonthlyModel.CategoryItem
            {
                CategoryName = x.CategoryName,
                Month = -x.Value,
                ValueFormat = model.ValueFormat
            }).ToList();
        }

        private void AddReportWeekly(MonthlyModel model)
        {
            var now = DateTime.Today;

            model.ShowWeekly = model.SelectedYear == now.Year && model.SelectedMonth == now.Month;

            if (!model.ShowWeekly)
                return;

            var firstDay = now.DayOfWeek == DayOfWeek.Sunday
                ? now.AddDays(-6)
                : now.AddDays(1 - (int)now.DayOfWeek);

            var data = Searches.Report.SelectReportWeekly(AccountId, firstDay);

            foreach (var current in data)
            {
                var existing = model.Categories.Find(x => string.Equals(x.CategoryName, current.CategoryName, StringComparison.OrdinalIgnoreCase));

                if (existing != null)
                {
                    existing.Week = -current.Value;
                }
                else
                {
                    model.Categories.Add(new MonthlyModel.CategoryItem
                    {
                        CategoryName = current.CategoryName,
                        Week = -current.Value,
                        ValueFormat = model.ValueFormat
                    });
                }
            }
        }

        private void AddReportPlan(MonthlyModel model)
        {
            var start = new DateTime(model.SelectedYear, model.SelectedMonth, 1);
            var end = start.AddMonths(1);

            var payments = Searches.PlanPayment
                .GetPayments(AccountId, start, end)
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
                    var category = Searches.Category.SelectFirst(x => x.CategoryId == payment.CategoryId);
                    if (category == null)
                        throw new ArgumentException($"Category with id = {payment.CategoryId} is not found");

                    categories.Add(payment.CategoryId.Value, categoryName = category.Name);
                }

                if (!rates.TryGetValue(payment.WalletId, out var rate))
                {
                    rate = Searches.Wallet.BindFirst(x => x.Currency.CurrencyRates
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
                    existing.Plan += value;
                }
                else
                {
                    model.Categories.Add(new MonthlyModel.CategoryItem
                    {
                        CategoryName = categoryName,
                        Plan = value,
                        ValueFormat = model.ValueFormat
                    });
                }
            }
        }

        private void AddReportMonthlySummary(MonthlyModel model)
        {
            var summary = Searches.Report.SelectReportMonthlySummary(AccountId, model.SelectedYear, model.SelectedMonth);

            model.Summaries = new List<MonthlyModel.Summary>
            {
                new MonthlyModel.Summary
                {
                    Name = "All Wallets Total",
                    ValueFormat = model.ValueFormat,
                    Beginning = summary.Beginning,
                    Current = summary.Current,
                }
            };
        }

        private void AddTaxReportMonthlyWalletItem(MonthlyModel model)
        {
            var currentMonth = new DateTime(model.SelectedYear, model.SelectedMonth, 1);
            var lastMonth = currentMonth.AddMonths(-1);

            var current = CalculateUnpaidTax(currentMonth.Year, currentMonth.Month, currentMonth.AddMonths(1).AddDays(-1));
            var beginning = CalculateUnpaidTax(lastMonth.Year, lastMonth.Month, lastMonth.AddMonths(1).AddDays(-1));

            model.Summaries.Add(new MonthlyModel.Summary
            {
                Name = "Unpaid Taxes",
                ValueFormat = model.ValueFormat,
                Beginning = -beginning,
                Current = -current,
            });
        }

        private decimal CalculateUnpaidTax(int year, int? limitMonth, DateTime? limitTaxPaymentDate)
        {
            if (year < 2020)
                return 0;

            var tax = 0m;
            var persons = Searches.Person.Select(x => x.AccountId == AccountId);

            foreach (var person in persons)
            {
                tax += GetTotalTaxNotPaid(person.PersonId, year, limitMonth, limitTaxPaymentDate);

                if (year > 2020)
                    tax += GetTotalTaxNotPaid(person.PersonId, year - 1, null, limitTaxPaymentDate);
            }

            return tax;
        }

        private decimal GetTotalTaxNotPaid(int personId, int year, int? limitMonth, DateTime? limitTaxPaymentDate)
        {
            var taxYearEntity = Searches.TaxYear.SelectFirst(x => x.PersonId == personId && x.Year == year);

            if (taxYearEntity != null && (limitTaxPaymentDate == null || taxYearEntity.Closed <= limitTaxPaymentDate))
                return 0;

            var taxes = TaxModelHelper.CreateModel(AccountId, personId, year, limitMonth, limitTaxPaymentDate);

            return taxes.TaxTotalValue > taxes.TaxPaidTotal ? taxes.TaxTotalValue - taxes.TaxPaidTotal : 0;
        }
    }
}
