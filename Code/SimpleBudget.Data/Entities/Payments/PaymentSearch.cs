using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class PaymentSearch : SearchHelper<Payment>
    {
        public PaymentSearch(BudgetDbContext context) : base(context) { }

        public async Task<decimal> Sum(PaymentFilter filter)
        {
            var query = FilterQuery(filter, Context.Payments);

            var sums = await query
                .AsNoTracking()
                .GroupBy(x => x.Wallet.CurrencyId)
                .Select(x => new
                {
                    CurrencyId = x.Key,
                    Sum = x.Sum(x => x.Value)
                })
                .ToListAsync();

            var totalSum = 0m;

            foreach (var sum in sums)
            {
                var rate = Context
                    .CurrencyRates
                    .Where(y => y.CurrencyId == sum.CurrencyId && !y.BankOfCanada)
                    .OrderByDescending(y => y.StartDate)
                    .Select(y => (decimal?)y.Rate)
                    .FirstOrDefault() ?? 1;

                totalSum += sum.Sum * rate;
            }

            return totalSum;
        }

        public async Task<int> GetRowNumber(int paymentId, PaymentFilter filter)
        {
            var payment = await Context.Payments.AsNoTracking().FirstOrDefaultAsync(x => x.PaymentId == paymentId);

            if (payment == null)
                return -1;

            var query = FilterQuery(filter, Context.Payments);
                
            var count = await query.Where(x =>
                x.PaymentDate >= payment.PaymentDate
                && (
                    x.PaymentDate > payment.PaymentDate
                    || x.PaymentDate == payment.PaymentDate && x.PaymentId > payment.PaymentId
                )
            ).CountAsync();

            return count + 1;
        }

        public async Task<int> Count(PaymentFilter filter)
        {
            return await Count((IQueryable<Payment> query) => FilterQuery(filter, query));
        }

        public async Task<List<T>> Bind<T>(
            Expression<Func<Payment, T>> binder,
            PaymentFilter filter,
            Func<IQueryable<T>, IQueryable<T>>? process)
        {
            return await ExecuteQuery(
                async query => await BuildQuery(
                        query,
                        (IQueryable<Payment> q) => q.Select(binder),
                        (IQueryable<Payment> q) => FilterQuery(filter, q),
                        q => q,
                        process
                    ).ToListAsync()
            );
        }

        private static IQueryable<Payment> FilterQuery(PaymentFilter filter, IQueryable<Payment> query)
        {
            var result = query.Where(x => x.Wallet.AccountId == filter.AccountId);

            if (!filter.IncludeChildren)
                result = result.Where(x => x.ParentPaymentId == null);

            if (!string.IsNullOrEmpty(filter.Type))
            {
                if (string.Equals(filter.Type, "expenses", StringComparison.OrdinalIgnoreCase))
                    result = result.Where(x => x.Value <= 0 && x.Category.Name != "Transfer");
                else if (string.Equals(filter.Type, "income", StringComparison.OrdinalIgnoreCase))
                    result = result.Where(x => x.Value > 0 && x.Category.Name != "Transfer");
                else if (string.Equals(filter.Type, "transfer", StringComparison.OrdinalIgnoreCase))
                    result = result.Where(x => x.Category.Name == "Transfer");
            }

            if (!string.IsNullOrEmpty(filter.SearchText))
            {
                result = result.Where(x =>
                    x.Description!.Contains(filter.SearchText)
                    || x.Company.Name!.Contains(filter.SearchText)
                    || x.Category.Name!.Contains(filter.SearchText)
                    || x.Wallet.Name!.Contains(filter.SearchText)
                );
            }

            if (filter.PaymentYear.HasValue)
                result = result.Where(x => x.PaymentDate.Year == filter.PaymentYear);

            if (filter.PaymentMonth.HasValue)
                result = result.Where(x => x.PaymentDate.Month == filter.PaymentMonth);

            if (!string.IsNullOrEmpty(filter.Category))
                result = result.Where(x => x.Category.Name == filter.Category);

            return result;
        }
    }
}
