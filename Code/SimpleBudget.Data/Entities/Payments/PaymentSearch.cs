using System.Linq.Expressions;

namespace SimpleBudget.Data
{
    public class PaymentSearch : SearchHelper<Payment>
    {
        internal PaymentSearch() { }

        public int GetRowNumber(int paymentId, PaymentFilter filter)
        {
            using (var db = new BudgetDbContext())
            {
                var payment = db.Payments.AsNoTracking().FirstOrDefault(x => x.PaymentId == paymentId);

                if (payment == null)
                    return -1;

                var query = FilterQuery(filter, db.Payments);
                
                var count = query.Where(x =>
                    x.PaymentDate >= payment.PaymentDate
                    && (
                        x.PaymentDate > payment.PaymentDate
                        || x.PaymentDate == payment.PaymentDate && x.PaymentId > payment.PaymentId
                    )
                ).Count();

                return count + 1;
            }
        }

        public int Count(PaymentFilter filter)
        {
            return Count((IQueryable<Payment> query) => FilterQuery(filter, query));
        }

        public List<T> Bind<T>(
            Expression<Func<Payment, T>> binder,
            PaymentFilter filter,
            Func<IQueryable<T>, IQueryable<T>>? process)
        {
            return ExecuteQuery(
                query => BuildQuery(
                    query,
                    (IQueryable<Payment> q) => q.Select(binder),
                    (IQueryable<Payment> q) => FilterQuery(filter, q),
                    q => q,
                    process
                ).ToList()
            );
        }

        private static IQueryable<Payment> FilterQuery(PaymentFilter filter, IQueryable<Payment> query)
        {
            var result = query.Where(x => x.Wallet.AccountId == filter.AccountId && x.ParentPaymentId == null);

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
