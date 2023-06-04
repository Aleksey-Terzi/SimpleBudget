using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class TaxRateSearch : SearchHelper<TaxRate>
    {
        public TaxRateSearch(BudgetDbContext context) : base(context) { }

        public async Task<int> SelectLatestYear(int accountId, string name, int maxYear)
        {
            return await Context.TaxRates
                .Where(x => x.AccountId == accountId && x.Name == name && x.PeriodYear <= maxYear)
                .MaxAsync(x => x.PeriodYear);
        }
    }
}
