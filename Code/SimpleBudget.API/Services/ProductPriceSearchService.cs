using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class ProductPriceSearchService
    {
        private readonly IdentityService _identity;
        private readonly ProductPriceSearch _productPriceSearch;

        public ProductPriceSearchService(
            IdentityService identity,
            ProductPriceSearch productPriceSearch
            )
        {
            _identity = identity;
            _productPriceSearch = productPriceSearch;
        }

        public async Task<(ProductPriceGridModel[] Items, PaginationData Pagination)> Search(ProductPriceFilterModel input)
        {
            var filter = new ProductPriceFilter
            {
                AccountId = _identity.AccountId,
                Keyword = input.Keyword
            };

            var itemCount = await _productPriceSearch.Count(filter);

            var page = await FilterHelper.GetPageAsync(
                input.Id,
                input.Page,
                itemCount,
                async (int id) => await _productPriceSearch.GetRowNumber(id, filter)
                );

            var items = await GetItems(filter, page);
            var pagination = FilterHelper.GetPagination(page, itemCount);

            return (items, pagination);
        }

        private async Task<ProductPriceGridModel[]> GetItems(ProductPriceFilter filter, int page)
        {
            var skip = (page - 1) * FilterHelper.PageSize;

            var preItems = await _productPriceSearch.Bind(
                x => new
                {
                    x.ProductPriceId,
                    ProductName = x.Product.Name,
                    CompanyName = x.Company!.Name,
                    CategoryName = x.Category!.Name,
                    x.Price,
                    x.PriceDate,
                    x.IsDiscount,
                    x.Quantity,
                    x.Description
                },
                filter,
                q => q
                    .OrderByDescending(x => x.PriceDate)
                    .ThenByDescending(x => x.ProductPriceId)
                    .Skip(skip)
                    .Take(FilterHelper.PageSize)
            );

            return preItems.Select(x => new ProductPriceGridModel
            {
                ProductPriceId = x.ProductPriceId,
                ProductName = x.ProductName,
                CompanyName = x.CompanyName,
                CategoryName = x.CategoryName,
                Price = x.Price,
                PriceDate = DateHelper.ToClient(x.PriceDate)!,
                IsDiscount = x.IsDiscount,
                Quantity = x.Quantity,
                Description = x.Description
            }).ToArray();
        }

        public async Task<ProductPriceEditModel?> GetProductPrice(int productPriceId)
        {
            var productPrice = await _productPriceSearch.SelectFirst(
                x => x.Product.AccountId == _identity.AccountId && x.ProductPriceId == productPriceId,
                x => x.Product,
                x => x.Company!,
                x => x.Category!
            );

            if (productPrice == null)
                return null;

            var model = new ProductPriceEditModel
            {
                ProductName = productPrice.Product.Name,
                CompanyName = productPrice.Company?.Name,
                CategoryName = productPrice.Category?.Name,
                PriceDate = DateHelper.ToClient(productPrice.PriceDate)!,
                Price = productPrice.Price,
                IsDiscount = productPrice.IsDiscount,
                Quantity = productPrice.Quantity,
                Description = productPrice.Description
            };

            return model;
        }
    }
}
