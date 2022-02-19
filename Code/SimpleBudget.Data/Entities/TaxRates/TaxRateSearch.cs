namespace SimpleBudget.Data
{
    public class TaxRateSearch : SearchHelper<TaxRate>
    {
        internal TaxRateSearch() { }

        public int SelectLatestYear(int accountId, string name, int maxYear)
        {
            using (var db = new BudgetDbContext())
                return db.TaxRates.Where(x => x.AccountId == accountId && x.Name == name && x.PeriodYear <= maxYear).Max(x => x.PeriodYear);
        }
    }
}
