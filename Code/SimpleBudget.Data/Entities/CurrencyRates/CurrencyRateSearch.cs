using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class CurrencyRateSearch : SearchHelper<CurrencyRate>
    {
        public CurrencyRateSearch(BudgetDbContext context) : base(context) { }

        public async Task<int> GetRowNumber(int currencyId, int currencyRateId)
        {
            var rate = await Context.CurrencyRates.AsNoTracking().FirstOrDefaultAsync(x => x.CurrencyRateId == currencyRateId);
            if (rate == null)
                return -1;

            var count = await Context.CurrencyRates
                .Where(x =>
                    x.StartDate >= rate.StartDate
                    && (
                        x.StartDate > rate.StartDate
                        || x.StartDate == rate.StartDate && x.CurrencyRateId > rate.CurrencyRateId
                )
            ).CountAsync();

            return count + 1;
        }
    }
}
