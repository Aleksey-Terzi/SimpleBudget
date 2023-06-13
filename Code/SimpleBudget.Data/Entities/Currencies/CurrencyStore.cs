using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class CurrencyStore : StoreHelper<Currency>
    {
        public CurrencyStore(BudgetDbContext context) : base(context) { }

        public async Task DeleteWithRates(int currencyId)
        {
            var currency = await Context.Currencies
                .Where(x => x.CurrencyId == currencyId)
                .Include(x => x.CurrencyRates)
                .FirstAsync();


            Context.CurrencyRates.RemoveRange(currency.CurrencyRates);
            Context.Currencies.Remove(currency);

            await Context.SaveChangesAsync();
        }
    }
}
