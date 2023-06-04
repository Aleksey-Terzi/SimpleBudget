namespace SimpleBudget.Data
{
    public class CurrencySearch : SearchHelper<Currency>
    {
        public CurrencySearch(BudgetDbContext context) : base(context) { }
    }
}
