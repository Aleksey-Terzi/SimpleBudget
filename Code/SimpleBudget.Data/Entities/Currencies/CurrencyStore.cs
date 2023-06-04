namespace SimpleBudget.Data
{
    public class CurrencyStore : StoreHelper<Currency>
    {
        public CurrencyStore(BudgetDbContext context) : base(context) { }
    }
}
