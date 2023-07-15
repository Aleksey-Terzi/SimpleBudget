using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class TaxYearSearch : SearchHelper<TaxYear>
    {
        public TaxYearSearch(BudgetDbContext context) : base(context) { }

        public async Task<int?> MinYear(int accountId)
        {
            return await Context.TaxYears
                .Where(x => x.Person.AccountId == accountId)
                .MinAsync(x => (int?)x.Year);
        }
    }
}
