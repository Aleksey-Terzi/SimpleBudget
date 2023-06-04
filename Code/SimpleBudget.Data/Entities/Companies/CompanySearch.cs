namespace SimpleBudget.Data
{
    public class CompanySearch : SearchHelper<Company>
    {
        public CompanySearch(BudgetDbContext context) : base(context) { }
    }
}
