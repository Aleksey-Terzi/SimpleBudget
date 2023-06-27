using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class TaxRateStore : StoreHelper<TaxRate>
    {
        public TaxRateStore(BudgetDbContext context) : base(context) { }

        public async Task Update(List<TaxRate> insert, List<TaxRate> update, List<TaxRate> delete)
        {
            await Context.TaxRates.AddRangeAsync(insert);
            Context.TaxRates.UpdateRange(update);
            Context.TaxRates.RemoveRange(delete);

            await Context.SaveChangesAsync();
        }

        public async Task Delete(int year)
        {
            var rates = await Context.TaxRates.Where(x => x.PeriodYear == year).ToListAsync();

            Context.TaxRates.RemoveRange(rates);

            await Context.SaveChangesAsync();
        }
    }
}
