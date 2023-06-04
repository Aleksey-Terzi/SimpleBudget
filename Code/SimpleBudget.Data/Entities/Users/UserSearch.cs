namespace SimpleBudget.Data
{
    public class UserSearch : SearchHelper<User>
    {
        public UserSearch(BudgetDbContext context) : base(context) { }
    }
}
