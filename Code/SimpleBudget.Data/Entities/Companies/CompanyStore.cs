namespace SimpleBudget.Data
{
    public class CompanyStore : StoreHelper<Company>
    {
        public CompanyStore(BudgetDbContext context) : base(context) { }
    }
}
