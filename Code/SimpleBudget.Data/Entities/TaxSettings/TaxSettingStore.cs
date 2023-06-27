using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class TaxSettingStore : StoreHelper<TaxSetting>
    {
        public TaxSettingStore(BudgetDbContext context) : base(context) { }

        public async Task Update(List<TaxSetting> insert, List<TaxSetting> update)
        {
            await Context.TaxSettings.AddRangeAsync(insert);
            Context.TaxSettings.UpdateRange(update);

            await Context.SaveChangesAsync();
        }

        public async Task Delete(int year)
        {
            var settings = await Context.TaxSettings.Where(x => x.PeriodYear == year).ToListAsync();

            Context.TaxSettings.RemoveRange(settings);

            await Context.SaveChangesAsync();
        }
    }
}
