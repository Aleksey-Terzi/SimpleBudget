namespace SimpleBudget.Data
{
    public class ProductSearch : SearchHelper<Product>
    {
        public ProductSearch(BudgetDbContext context) : base(context) { }
    }
}
