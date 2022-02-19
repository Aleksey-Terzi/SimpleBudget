using System.Data.Entity;

namespace SimpleBudget.Data
{
    public class ReportSearch
    {
        internal ReportSearch() { }

        public List<WalletSummary> SelectWalletSummary(int accountId)
        {
            using (var db = new BudgetDbContext())
            {
                return db.Payments
                    .Where(x => x.Wallet.AccountId == accountId)
                    .GroupBy(x => x.Wallet)
                    .Select(x => new WalletSummary
                    {
                        WalletName = x.Key.Name,
                        CurrencyCode = x.Key.Currency.Code,
                        ValueFormat = x.Key.Currency.ValueFormat,
                        Value = x.Sum(y => y.Value),
                        Rate = x.Key.Currency.CurrencyRates.Where(y => !y.BankOfCanada).OrderByDescending(y => y.StartDate).Select(y => (decimal?)y.Rate).FirstOrDefault() ?? 1
                    })
                    .OrderBy(x => x.CurrencyCode == "CAD" ? 0 : (x.CurrencyCode == "USD" ? 1 : 2))
                    .ThenBy(x => x.CurrencyCode)
                    .ThenBy(x => x.WalletName)
                    .ToList();
            }
        }

        public ReportMonthlySummary SelectReportMonthlySummary(int accountId, int year, int month)
        {
            var firstDay = new DateTime(year, month, 1);
            var lastDay = (new DateTime(year, month, 1)).AddMonths(1);

            using (var db = new BudgetDbContext())
            {
                var wallets = db.Payments
                    .Where(x => x.Wallet.AccountId == accountId && x.PaymentDate < lastDay)
                    .GroupBy(x => x.Wallet)
                    .Select(x => new
                    {
                        Beginning = x.Where(y => y.PaymentDate < firstDay).Sum(y => (decimal?)y.Value),
                        Current = x.Sum(y => (decimal?)y.Value),
                        Expenses = x.Where(y => y.PaymentDate >= firstDay && y.Value < 0 && (y.Category == null || y.Category.Name != "Transfer")).Sum(y => (decimal?)y.Value),
                        Income = x.Where(y => y.PaymentDate >= firstDay && y.Value > 0 && (y.Category == null || y.Category.Name != "Transfer")).Sum(y => (decimal?)y.Value),
                        BeginningRate = x.Key.Currency.CurrencyRates.Where(y => y.StartDate < firstDay && !y.BankOfCanada).OrderByDescending(y => y.StartDate).Select(y => (decimal?)y.Rate).FirstOrDefault() ?? 1,
                        CurrentRate = x.Key.Currency.CurrencyRates.Where(y => y.StartDate < lastDay && !y.BankOfCanada).OrderByDescending(y => y.StartDate).Select(y => (decimal?)y.Rate).FirstOrDefault() ?? 1
                    })
                    .ToList();

                return new ReportMonthlySummary
                {
                    Beginning = wallets.Count > 0 ? wallets.Sum(x => (x.Beginning ?? 0) * x.BeginningRate) : 0,
                    Current = wallets.Count > 0 ? wallets.Sum(x => (x.Current ?? 0) * x.CurrentRate) : 0,
                    Expenses = wallets.Count > 0 ? wallets.Sum(x => (x.Expenses ?? 0) * x.CurrentRate) : 0,
                    Income = wallets.Count > 0 ? wallets.Sum(x => (x.Income ?? 0) * x.CurrentRate) : 0
                };
            }
        }

        public List<ReportMonthly.Category> SelectReportWeekly(int accountId, DateTime firstDay)
        {
            var lastDay = firstDay.AddDays(7);

            using (var db = new BudgetDbContext())
            {
                return db.Payments
                    .Where(x =>
                        x.Wallet.AccountId == accountId
                        && x.PaymentDate >= firstDay
                        && x.PaymentDate < lastDay
                        && x.Value < 0
                        && x.Category.Name != "Transfer"
                        && x.Category.Name != Constants.Category.Taxes
                    )
                    .GroupBy(x => x.Category.Name ?? "[No Category]")
                    .Select(x => new ReportMonthly.Category
                    {
                        CategoryName = x.Key,
                        Value = x.Sum(y =>
                            y.Value * (y.Wallet.Currency.CurrencyRates
                                                                    .Where(z =>
                                                                        z.StartDate < lastDay
                                                                        && !z.BankOfCanada
                                                                    )
                                                                    .OrderByDescending(z => z.StartDate)
                                                                    .Select(z => (decimal?)z.Rate)
                                                                    .FirstOrDefault() ?? 1m)
                        )
                    })
                    .ToList();
            }
        }

        public ReportMonthly SelectReportMonthly(int accountId, int year, int month)
        {
            var firstDay = new DateTime(year, month, 1);
            var lastDay = (new DateTime(year, month, 1)).AddMonths(1);

            using (var db = new BudgetDbContext())
            {
                var payments = db.Payments
                    .Include(x => x.Category)
                    .Where(x =>
                        x.Wallet.AccountId == accountId
                        && x.PaymentDate >= firstDay
                        && x.PaymentDate < lastDay
                    )
                    .ToList();

                var wallets = GetReportMonthlyWallets(firstDay, lastDay, payments, db);
                var categories = GetReportMonthlyCategories(payments, wallets);

                return new ReportMonthly
                {
                    Wallets = wallets,
                    Categories = categories
                };
            }
        }

        private static List<ReportMonthly.Wallet> GetReportMonthlyWallets(DateTime firstDay, DateTime lastDay, List<Payment> payments, BudgetDbContext db)
        {
            var walletIds = payments.Select(x => x.WalletId).Distinct();

            var wallets = db.Wallets
                .Where(x => walletIds.Contains(x.WalletId))
                .Select(x => new
                {
                    WalletId = x.WalletId,
                    WalletName = x.Name,
                    CurrencyCode = x.Currency.Code,
                    ValueFormat = x.Currency.ValueFormat,
                    BeginningRate = x.Currency.CurrencyRates.Where(y => y.StartDate < firstDay && !y.BankOfCanada).OrderByDescending(y => y.StartDate).Select(y => (decimal?)y.Rate).FirstOrDefault() ?? 1,
                    CurrentRate = x.Currency.CurrencyRates.Where(y => y.StartDate < lastDay && !y.BankOfCanada).OrderByDescending(y => y.StartDate).Select(y => (decimal?)y.Rate).FirstOrDefault() ?? 1,
                })
                .ToList();

            var beginings = db.Payments
                .Where(x => walletIds.Contains(x.WalletId) && x.PaymentDate < firstDay)
                .GroupBy(x => x.Wallet)
                .Select(x => new
                {
                    WalletId = x.Key.WalletId,
                    Beginning = x.Sum(y => y.Value),
                })
                .ToList();

            var result = wallets.Select(x => new ReportMonthly.Wallet
                {
                    WalletId = x.WalletId,
                    WalletName = x.WalletName,
                    CurrencyCode = x.CurrencyCode,
                    ValueFormat = x.ValueFormat,
                    Beginning = beginings.Find(y => y.WalletId == x.WalletId)?.Beginning ?? 0,
                    Income = payments.Where(y => y.WalletId == x.WalletId && y.Value > 0).Select(y => y.Value).DefaultIfEmpty(0).Sum(),
                    Expenses = payments.Where(y => y.WalletId == x.WalletId && y.Value < 0).Select(y => y.Value).DefaultIfEmpty(0).Sum(),
                    BeginningRate = x.BeginningRate,
                    CurrentRate = x.CurrentRate
                })
                .OrderBy(x => x.CurrencyCode == "CAD" ? 0 : (x.CurrencyCode == "USD" ? 1 : 2))
                .ThenBy(x => x.WalletName)
                .ToList();

            return result;
        }

        private static List<ReportMonthly.Category> GetReportMonthlyCategories(List<Payment> payments, List<ReportMonthly.Wallet> wallets)
        {
            var categories = payments
                .Where(x => x.Value < 0 && x.Category?.Name != "Transfer" && x.Category?.Name != Constants.Category.Taxes)
                .GroupBy(x => x.Category?.Name ?? "[No Category]")
                .Select(x => new ReportMonthly.Category
                {
                    CategoryName = x.Key,
                    Value = x.Sum(y => y.Value * (wallets.Find(z => z.WalletId == y.WalletId)?.CurrentRate ?? 0))
                })
                .OrderBy(x => x.CategoryName)
                .ToList();

            return categories;
        }
    }
}
