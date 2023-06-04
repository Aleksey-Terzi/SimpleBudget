namespace SimpleBudget.Data
{
    public class CategoryStore : StoreHelper<Category>
    {
        public CategoryStore(BudgetDbContext context) : base(context) { }
    }
}
