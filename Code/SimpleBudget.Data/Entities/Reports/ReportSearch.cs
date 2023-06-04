using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class ReportSearch
    {
        private readonly BudgetDbContext _context;

        public ReportSearch(BudgetDbContext context)
        {
            _context = context;
        }

        public async Task<List<WalletSummary>> SelectWalletSummary(int accountId)
        {
            return await _context.Payments
                .Where(x => x.Wallet.AccountId == accountId)
                .GroupBy(x => new
                {
                    x.Wallet.Name,
                    x.Wallet.Currency.CurrencyId,
                    x.Wallet.Currency.Code,
                    x.Wallet.Currency.ValueFormat,
                })
                .Select(x => new WalletSummary
                {
                    WalletName = x.Key.Name,
                    CurrencyCode = x.Key.Code,
                    ValueFormat = x.Key.ValueFormat,
                    Value = x.Sum(y => y.Value),
                    Rate = _context
                        .CurrencyRates
                        .Where(y => y.CurrencyId == x.Key.CurrencyId && !y.BankOfCanada)
                        .OrderByDescending(y => y.StartDate)
                        .Select(y => (decimal?)y.Rate)
                        .FirstOrDefault() ?? 1
                })
                .OrderBy(x => x.CurrencyCode == "CAD" ? 0 : (x.CurrencyCode == "USD" ? 1 : 2))
                .ThenBy(x => x.CurrencyCode)
                .ThenBy(x => x.WalletName)
                .ToListAsync();
        }

        public async Task<ReportMonthlySummary> SelectReportMonthlySummary(int accountId, int year, int month)
        {
            var firstDay = new DateTime(year, month, 1);
            var lastDay = (new DateTime(year, month, 1)).AddMonths(1);

            var wallets = await _context.Payments
                .Where(x => x.Wallet.AccountId == accountId && x.PaymentDate < lastDay)
                .GroupBy(x => x.Wallet)
                .Select(x => new
                {
                    Beginning = x.Where(y => y.PaymentDate < firstDay).Sum(y => (decimal?)y.Value),
                    Current = x.Sum(y => (decimal?)y.Value),
                    Expenses = x.Where(y => y.PaymentDate >= firstDay && y.Value < 0 && (y.Category == null || y.Category.Name != "Transfer")).Sum(y => (decimal?)y.Value),
                    Income = x.Where(y => y.PaymentDate >= firstDay && y.Value > 0 && (y.Category == null || y.Category.Name != "Transfer")).Sum(y => (decimal?)y.Value),
                    BeginningRate = _context.CurrencyRates
                        .Where(y => y.CurrencyId == x.Key.CurrencyId && y.StartDate < firstDay && !y.BankOfCanada)
                        .OrderByDescending(y => y.StartDate)
                        .Select(y => (decimal?)y.Rate)
                        .FirstOrDefault() ?? 1,
                    CurrentRate = _context.CurrencyRates
                        .Where(y => y.CurrencyId == x.Key.CurrencyId && y.StartDate < firstDay && !y.BankOfCanada)
                        .OrderByDescending(y => y.StartDate)
                        .Select(y => (decimal?)y.Rate)
                        .FirstOrDefault() ?? 1
                })
                .ToListAsync();

            return new ReportMonthlySummary
            {
                Beginning = wallets.Count > 0 ? wallets.Sum(x => (x.Beginning ?? 0) * x.BeginningRate) : 0,
                Current = wallets.Count > 0 ? wallets.Sum(x => (x.Current ?? 0) * x.CurrentRate) : 0,
                Expenses = wallets.Count > 0 ? wallets.Sum(x => (x.Expenses ?? 0) * x.CurrentRate) : 0,
                Income = wallets.Count > 0 ? wallets.Sum(x => (x.Income ?? 0) * x.CurrentRate) : 0
            };
        }

        public async Task<List<ReportMonthly.Category>> SelectReportWeekly(int accountId, DateTime firstDay)
        {
            var lastDay = firstDay.AddDays(7);

            var values = await _context.Payments
                .Where(x =>
                    x.Wallet.AccountId == accountId
                    && x.PaymentDate >= firstDay
                    && x.PaymentDate < lastDay
                    && x.Value < 0
                    && x.Category.Name != "Transfer"
                    && x.Category.Name != Constants.Category.Taxes
                )
                .GroupBy(x => new
                {
                    CategoryName = x.Category.Name ?? "[No Category]",
                    x.Wallet.CurrencyId
                })
                .Select(x => new
                {
                    x.Key.CategoryName,
                    x.Key.CurrencyId,
                    Value = x.Sum(y => y.Value)
                })
                .ToListAsync();

            var currencyIds = values.Select(x => x.CurrencyId).Distinct().ToList();

            var currencies = await _context.CurrencyRates
                .Where(x => currencyIds.Contains(x.CurrencyId)
                    && x.StartDate < lastDay
                    && !x.BankOfCanada
                )
                .GroupBy(x => x.CurrencyId)
                .Select(x => new
                {
                    CurrencyId = x.Key,
                    x.OrderByDescending(x => x.StartDate).First().Rate
                })
                .ToListAsync();

            var currencyMap = currencies.ToDictionary(x => x.CurrencyId, x => x.Rate);
            foreach (var currencyId in currencyIds)
            {
                if (!currencyMap.ContainsKey(currencyId))
                    currencyMap.Add(currencyId, 1);
            }

            return values
                .GroupBy(x => x.CategoryName)
                .Select(x => new ReportMonthly.Category
                {
                    CategoryName = x.Key,
                    Value = x.Sum(y => y.Value * currencyMap[y.CurrencyId])
                })
                .ToList();
        }

        public async Task<ReportMonthly> SelectReportMonthly(int accountId, int year, int month)
        {
            var firstDay = new DateTime(year, month, 1);
            var lastDay = (new DateTime(year, month, 1)).AddMonths(1);

            var payments = await _context.Payments
                .Include(x => x.Category)
                .Where(x =>
                    x.Wallet.AccountId == accountId
                    && x.PaymentDate >= firstDay
                    && x.PaymentDate < lastDay
                )
                .ToListAsync();

            var wallets = await GetReportMonthlyWallets(firstDay, lastDay, payments);
            var categories = GetReportMonthlyCategories(payments, wallets);

            return new ReportMonthly
            {
                Wallets = wallets,
                Categories = categories
            };
        }

        private async Task<List<ReportMonthly.Wallet>> GetReportMonthlyWallets(DateTime firstDay, DateTime lastDay, List<Payment> payments)
        {
            var walletIds = payments.Select(x => x.WalletId).Distinct();

            var wallets = await _context.Wallets
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
                .ToListAsync();

            var beginings = await _context.Payments
                .Where(x => walletIds.Contains(x.WalletId) && x.PaymentDate < firstDay)
                .GroupBy(x => x.Wallet)
                .Select(x => new
                {
                    WalletId = x.Key.WalletId,
                    Beginning = x.Sum(y => y.Value),
                })
                .ToListAsync();

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
