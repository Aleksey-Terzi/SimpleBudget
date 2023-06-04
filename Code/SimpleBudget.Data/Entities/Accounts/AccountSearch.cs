namespace SimpleBudget.Data
{
    public class AccountSearch : SearchHelper<Account>
    {
        public AccountSearch(BudgetDbContext context) : base(context) { }
    }
}
