namespace SimpleBudget.Data
{
    public class ProductPriceStore : StoreHelper<ProductPrice>
    {
        public ProductPriceStore(BudgetDbContext context) : base(context) { }

        public async Task InsertMany(List<ProductPrice> productPrices)
        {
            await Context.ProductPrices.AddRangeAsync(productPrices);
            await Context.SaveChangesAsync();
        }
    }
}
