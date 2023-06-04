namespace SimpleBudget.Data
{
    public class TaxYearStore : StoreHelper<TaxYear>
    {
        public TaxYearStore(BudgetDbContext context) : base(context) { }
    }
}
