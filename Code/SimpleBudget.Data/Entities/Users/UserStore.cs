namespace SimpleBudget.Data
{
    public class UserStore : StoreHelper<User>
    {
        public UserStore(BudgetDbContext context) : base(context) { }
    }
}
