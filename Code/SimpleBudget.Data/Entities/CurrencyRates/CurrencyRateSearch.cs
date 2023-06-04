namespace SimpleBudget.Data
{
    public class CurrencyRateSearch : SearchHelper<CurrencyRate>
    {
        public CurrencyRateSearch(BudgetDbContext context) : base(context) { }
    }
}
