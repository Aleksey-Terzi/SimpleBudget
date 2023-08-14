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
            query = query.Where(x => x.Wallet.AccountId == filter.AccountId);

            if (!filter.IncludeChildren)
                query = query.Where(x => x.ParentPaymentId == null);

            if (!string.IsNullOrEmpty(filter.Type))
            {
                if (string.Equals(filter.Type, "expenses", StringComparison.OrdinalIgnoreCase))
                    query = query.Where(x => x.Value <= 0 && x.Category.Name != "Transfer");
                else if (string.Equals(filter.Type, "income", StringComparison.OrdinalIgnoreCase))
                    query = query.Where(x => x.Value > 0 && x.Category.Name != "Transfer");
                else if (string.Equals(filter.Type, "transfer", StringComparison.OrdinalIgnoreCase))
                    query = query.Where(x => x.Category.Name == "Transfer");
            }

            query = filter.AdvancedFilter == null
                ? AddSimpleFilter(filter, query)
                : AddAdvancedFilter(filter.Type, filter.AdvancedFilter, query);

            return query;
        }

        private static IQueryable<Payment> AddSimpleFilter(PaymentFilter filter, IQueryable<Payment> query)
        {
            if (!string.IsNullOrEmpty(filter.SearchText))
            {
                query = query.Where(x =>
                    x.Description!.Contains(filter.SearchText)
                    || x.Company.Name!.Contains(filter.SearchText)
                    || x.Category.Name!.Contains(filter.SearchText)
                    || x.Wallet.Name!.Contains(filter.SearchText)
                );
            }

            if (filter.PaymentYear.HasValue)
                query = query.Where(x => x.PaymentDate.Year == filter.PaymentYear);

            if (filter.PaymentMonth.HasValue)
                query = query.Where(x => x.PaymentDate.Month == filter.PaymentMonth);

            if (!string.IsNullOrEmpty(filter.Category))
                query = query.Where(x => x.Category.Name == filter.Category);

            return query;
        }

        private static IQueryable<Payment> AddAdvancedFilter(string? type, PaymentAdvancedFilter filter, IQueryable<Payment> query)
        {
            if (filter.StartDate.HasValue)
                query = query.Where(x => x.PaymentDate >= filter.StartDate);

            if (filter.EndDate.HasValue)
                query = query.Where(x => x.PaymentDate <= filter.EndDate);

            if (!string.IsNullOrEmpty(filter.Keyword))
            {
                query = query.Where(x =>
                    x.Description!.Contains(filter.Keyword)
                    || x.Company.Name!.Contains(filter.Keyword)
                    || x.Category.Name!.Contains(filter.Keyword)
                    || x.Wallet.Name!.Contains(filter.Keyword)
                );
            }

            if (!string.IsNullOrEmpty(filter.Company))
                query = query.Where(x => x.Company.Name!.Contains(filter.Company));

            if (!string.IsNullOrEmpty(filter.Category))
                query = query.Where(x => x.Category.Name!.Contains(filter.Category));

            if (!string.IsNullOrEmpty(filter.Wallet))
                query = query.Where(x => x.Wallet.Name!.Contains(filter.Wallet));

            query = AddAdvancedFilterByValue(type, filter, query);

            return query;
        }

        private static IQueryable<Payment> AddAdvancedFilterByValue(string? type, PaymentAdvancedFilter filter, IQueryable<Payment> query)
        {
            if (string.Equals(type, "expenses", StringComparison.OrdinalIgnoreCase)
                || string.Equals(type, "transfer", StringComparison.OrdinalIgnoreCase)
                )
            {
                if (filter.StartValue.HasValue)
                    query = query.Where(x => x.Value <= -filter.StartValue);

                if (filter.EndValue.HasValue)
                    query = query.Where(x => x.Value >= -filter.EndValue);
            }
            else if (string.Equals(type, "income", StringComparison.OrdinalIgnoreCase))
            {
                if (filter.StartValue.HasValue)
                    query = query.Where(x => x.Value >= filter.StartValue);

                if (filter.EndValue.HasValue)
                    query = query.Where(x => x.Value <= filter.EndValue);
            }
            else
            {
                if (filter.StartValue.HasValue)
                    query = query.Where(x => x.Value >= filter.StartValue || x.Value <= -filter.StartValue);

                if (filter.EndValue.HasValue)
                    query = query.Where(x => x.Value > 0 && x.Value <= filter.EndValue || x.Value >= -filter.EndValue && x.Value <= 0);
            }

            return query;
        }
    }
}
