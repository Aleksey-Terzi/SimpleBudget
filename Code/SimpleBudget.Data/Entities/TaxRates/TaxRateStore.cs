namespace SimpleBudget.Data
{
    public class TaxRateStore : StoreHelper<TaxRate>
    {
        public TaxRateStore(BudgetDbContext context) : base(context) { }
    }
}
