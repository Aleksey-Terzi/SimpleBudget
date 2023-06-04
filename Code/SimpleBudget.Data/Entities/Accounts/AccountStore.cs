namespace SimpleBudget.Data
{
    public class AccountStore : StoreHelper<Account>
    {
        public AccountStore(BudgetDbContext context) : base(context) { }
    }
}
