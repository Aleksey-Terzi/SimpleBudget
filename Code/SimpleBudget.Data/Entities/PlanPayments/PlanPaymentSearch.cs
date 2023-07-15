using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class PlanPaymentSearch : SearchHelper<PlanPayment>
    {
        public PlanPaymentSearch(BudgetDbContext context) : base(context) { }

        public async Task<List<Payment>> GetPayments(int accountId, DateTime start, DateTime end)
        {
            var planPayments = await Context.PlanPayments
                .Where(
                    x =>
                        x.Wallet.AccountId == accountId
                        && x.IsActive
                        && x.PaymentStartDate < end
                        && (x.PaymentEndDate == null || x.PaymentEndDate >= start)
                )
                .ToListAsync();

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

        public async Task<int> GetRowNumber(int planPaymentId, PlanPaymentFilter filter)
        {
            var planPayment = await Context.PlanPayments
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.PlanPaymentId == planPaymentId);

            if (planPayment == null)
                return -1;

            var query = FilterQuery(filter, Context.PlanPayments);

            var count = await query.Where(x =>
                x.PaymentStartDate >= planPayment.PaymentStartDate
                && (
                    x.PaymentStartDate > planPayment.PaymentStartDate
                    || x.PaymentStartDate == planPayment.PaymentStartDate && x.PlanPaymentId > planPayment.PlanPaymentId
                )
            ).CountAsync();

            return count + 1;
        }

        public async Task<int> Count(PlanPaymentFilter filter)
        {
            return await Count((IQueryable<PlanPayment> query) => FilterQuery(filter, query));
        }

        public async Task<List<T>> Bind<T>(
            Expression<Func<PlanPayment, T>> binder,
            PlanPaymentFilter filter,
            Func<IQueryable<T>, IQueryable<T>>? process)
        {
            return await ExecuteQuery(
                async query => await BuildQuery(
                    query,
                    (IQueryable<PlanPayment> q) => q.Select(binder),
                    (IQueryable<PlanPayment> q) => FilterQuery(filter, q),
                    q => q,
                    process
                ).ToListAsync()
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

            if (filter.ActiveAtNow.HasValue)
            {
                var thisMonth = new DateTime(filter.ActiveAtNow.Value.Year, filter.ActiveAtNow.Value.Month, 1);
                result = result.Where(x => x.IsActive && (x.PaymentEndDate == null || x.PaymentEndDate >= thisMonth));
            }

            if (filter.InactiveAtNow.HasValue)
            {
                var thisMonth = new DateTime(filter.InactiveAtNow.Value.Year, filter.InactiveAtNow.Value.Month, 1);
                result = result.Where(x => !x.IsActive && (x.PaymentEndDate == null || x.PaymentEndDate >= thisMonth));
            }

            return result;
        }
    }
}