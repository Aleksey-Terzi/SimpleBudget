using System.Linq.Expressions;

namespace SimpleBudget.Data
{
    public class PlanPaymentSearch : SearchHelper<PlanPayment>
    {
        internal PlanPaymentSearch() { }

        public List<Payment> GetPayments(int accountId, DateTime start, DateTime end)
        {
            List<PlanPayment> planPayments;

            using (var db = new BudgetDbContext())
            {
                planPayments = db.PlanPayments
                    .Where(
                        x =>
                            x.Wallet.AccountId == accountId
                            && x.IsActive
                            && x.PaymentStartDate < end
                            && (x.PaymentEndDate == null || x.PaymentEndDate >= start)
                    )
                    .ToList();
            }

            var payments = new List<Payment>();

            foreach (var plan in planPayments)
            {
                var payment = new Payment
                {
                    WalletId = plan.WalletId,
                    CategoryId = plan.CategoryId,
                    CompanyId = plan.CompanyId,
                    PersonId = plan.PersonId,
                    Value = plan.Value,
                    Description = plan.Description,
                    Taxable = plan.Taxable,
                    TaxYear = plan.TaxYear
                };

                payments.Add(payment);
            }

            return payments;
        }

        public int GetRowNumber(int planPaymentId, PlanPaymentFilter filter)
        {
            using (var db = new BudgetDbContext())
            {
                var planPayment = db.PlanPayments.AsNoTracking().FirstOrDefault(x => x.PlanPaymentId == planPaymentId);

                if (planPayment == null)
                    return -1;

                var query = FilterQuery(filter, db.PlanPayments);

                var count = query.Where(x =>
                    x.PaymentStartDate >= planPayment.PaymentStartDate
                    && (
                        x.PaymentStartDate > planPayment.PaymentStartDate
                        || x.PaymentStartDate == planPayment.PaymentStartDate && x.PlanPaymentId > planPayment.PlanPaymentId
                    )
                ).Count();

                return count + 1;
            }
        }

        public int Count(PlanPaymentFilter filter)
        {
            return Count((IQueryable<PlanPayment> query) => FilterQuery(filter, query));
        }

        public List<T> Bind<T>(
            Expression<Func<PlanPayment, T>> binder,
            PlanPaymentFilter filter,
            Func<IQueryable<T>, IQueryable<T>>? process)
        {
            return ExecuteQuery(
                query => BuildQuery(
                    query,
                    (IQueryable<PlanPayment> q) => q.Select(binder),
                    (IQueryable<PlanPayment> q) => FilterQuery(filter, q),
                    q => q,
                    process
                ).ToList()
            );
        }

        private static IQueryable<PlanPayment> FilterQuery(PlanPaymentFilter filter, IQueryable<PlanPayment> query)
        {
            var result = query.Where(x => x.Wallet.AccountId == filter.AccountId);

            if (!string.IsNullOrEmpty(filter.Type))
            {
                if (string.Equals(filter.Type, "expenses", StringComparison.OrdinalIgnoreCase))
                    result = result.Where(x => x.Value <= 0 && x.Category.Name != "Transfer");
                else if (string.Equals(filter.Type, "income", StringComparison.OrdinalIgnoreCase))
                    result = result.Where(x => x.Value > 0 && x.Category.Name != "Transfer");
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
                result = result.Where(x => x.PaymentStartDate.Year == filter.PaymentYear);

            if (filter.PaymentMonth.HasValue)
                result = result.Where(x => x.PaymentStartDate.Month == filter.PaymentMonth);

            if (!string.IsNullOrEmpty(filter.Category))
                result = result.Where(x => x.Category.Name == filter.Category);

            if (filter.IsActive.HasValue)
            {
                var now = TimeHelper.GetLocalTime();
                var thisMonth = new DateTime(now.Year, now.Month, 1);
                result = result.Where(x => x.IsActive == filter.IsActive && (x.PaymentEndDate == null || x.PaymentEndDate >= thisMonth));
            }

            return result;
        }
    }
}