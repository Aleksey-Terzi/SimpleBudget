namespace SimpleBudget.Data
{
    public class TaxYearSearch : SearchHelper<TaxYear>
    {
        public TaxYearSearch(BudgetDbContext context) : base(context) { }
    }
}
