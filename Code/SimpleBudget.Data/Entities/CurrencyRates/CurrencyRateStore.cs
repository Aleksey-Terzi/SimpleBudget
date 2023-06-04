namespace SimpleBudget.Data
{
    public class CurrencyRateStore : StoreHelper<CurrencyRate>
    {
        public CurrencyRateStore(BudgetDbContext context) : base(context) { }
    }
}
