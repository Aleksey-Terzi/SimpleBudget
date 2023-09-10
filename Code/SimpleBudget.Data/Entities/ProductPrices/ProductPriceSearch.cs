using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class ProductPriceSearch : SearchHelper<ProductPrice>
    {
        public ProductPriceSearch(BudgetDbContext context) : base(context) { }

        public async Task<int> GetRowNumber(int productPriceId, ProductPriceFilter filter)
        {
            var price = await Context.ProductPrices.AsNoTracking().FirstOrDefaultAsync(x => x.ProductPriceId == productPriceId);

            if (price == null)
                return -1;

            var query = FilterQuery(filter, Context.ProductPrices);

            var count = await query.Where(x =>
                x.PriceDate >= price.PriceDate
                && (
                    x.PriceDate > price.PriceDate
                    || x.PriceDate == price.PriceDate && x.ProductPriceId > price.ProductPriceId
                )
            ).CountAsync();

            return count + 1;
        }

        public async Task<int> Count(ProductPriceFilter filter)
        {
            return await Count((IQueryable<ProductPrice> query) => FilterQuery(filter, query));
        }

        public async Task<List<T>> Bind<T>(
            Expression<Func<ProductPrice, T>> binder,
            ProductPriceFilter filter,
            Func<IQueryable<T>, IQueryable<T>>? process)
        {
            return await ExecuteQuery(
                async query => await BuildQuery(
                        query,
                        (IQueryable<ProductPrice> q) => q.Select(binder),
                        (IQueryable<ProductPrice> q) => FilterQuery(filter, q),
                        q => q,
                        process
                    ).ToListAsync()
            );
        }

        private static IQueryable<ProductPrice> FilterQuery(ProductPriceFilter filter, IQueryable<ProductPrice> query)
        {
            query = query.Where(x => x.Product.AccountId == filter.AccountId);

            if (!string.IsNullOrEmpty(filter.Keyword))
            {
                query = query.Where(x =>
                    x.Description!.Contains(filter.Keyword)
                    || x.Product.Name.Contains(filter.Keyword)
                    || x.Company!.Name.Contains(filter.Keyword)
                    || x.Category!.Name.Contains(filter.Keyword)
                );
            }

            return query;
        }
    }
}
