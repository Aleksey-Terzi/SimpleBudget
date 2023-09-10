namespace SimpleBudget.Data
{
    public class ProductStore : StoreHelper<Product>
    {
        public ProductStore(BudgetDbContext context) : base(context) { }
    }
}
