namespace SimpleBudget.Data
{
    public class CategorySearch : SearchHelper<Category>
    {
        public CategorySearch(BudgetDbContext context) : base(context) { }
    }
}
