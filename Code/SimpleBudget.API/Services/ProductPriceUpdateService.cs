using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class ProductPriceUpdateService
    {
        private readonly IdentityService _identity;
        private readonly ProductPriceSearch _productPriceSearch;
        private readonly ProductPriceStore _productPriceStore;
        private readonly ProductSearch _productSearch;
        private readonly ProductStore _productStore;
        private readonly CompanyService _companyService;
        private readonly CategoryService _categoryService;

        public ProductPriceUpdateService(
            IdentityService identity,
            ProductPriceSearch productPriceSearch,
            ProductPriceStore productPriceStore,
            ProductSearch productSearch,
            ProductStore productStore,
            CompanyService companyService,
            CategoryService categoryService
            )
        {
            _identity = identity;
            _productPriceSearch = productPriceSearch;
            _productPriceStore = productPriceStore;
            _productSearch = productSearch;
            _productStore = productStore;
            _companyService = companyService;
            _categoryService = categoryService;
        }

        public async Task DeleteProductPrice(int productPriceId)
        {
            var productPrice = await _productPriceSearch.SelectFirst(x => x.Product.AccountId == _identity.AccountId && x.ProductPriceId == productPriceId);
            if (productPrice == null)
                throw new ArgumentException($"ProductPrice is not found: {productPriceId}");

            await _productPriceStore.Delete(productPrice);
        }

        public async Task UpdateProductPrice(int productPriceId, ProductPriceEditModel model)
        {
            var productPrice = await _productPriceSearch.SelectFirst(x => x.Product.AccountId == _identity.AccountId && x.ProductPriceId == productPriceId);
            if (productPrice == null)
                throw new ArgumentException($"ProductPrice is not found: {productPriceId}");

            await MapModel(model, productPrice);

            await _productPriceStore.Update(productPrice);
        }

        public async Task<int> CreateProductPrice(ProductPriceEditModel model)
        {
            var productPrice = new ProductPrice
            {
                CreatedOn = DateTime.UtcNow,
                CreatedByUserId = _identity.UserId,
            };

            await MapModel(model, productPrice);

            await _productPriceStore.Insert(productPrice);

            return productPrice.ProductPriceId;
        }

        private async Task MapModel(ProductPriceEditModel model, ProductPrice productPrice)
        {
            var categoryId = await _categoryService.GetOrCreateCategoryId(_identity.AccountId, model.CategoryName);

            productPrice.ProductId = await GetOrCreateProductId(model.ProductName, categoryId);
            productPrice.CompanyId = await _companyService.GetOrCreateCompanyId(_identity.AccountId, model.CompanyName);
            productPrice.CategoryId = categoryId;
            productPrice.PriceDate = DateHelper.ToServer(model.PriceDate)!.Value;
            productPrice.Price = model.Price;
            productPrice.IsDiscount = model.IsDiscount;
            productPrice.Quantity = model.Quantity;
            productPrice.Description = model.Description;
            productPrice.ModifiedOn = DateTime.UtcNow;
            productPrice.ModifiedByUserId = _identity.UserId;
        }

        public async Task<List<int>> CreateProductPriceMulti(ProductPriceMultiModel model)
        {
            var productPrices = await MapMultiModel(model);

            await _productPriceStore.InsertMany(productPrices);

            return productPrices.Select(x => x.ProductPriceId).ToList();
        }

        private async Task<List<ProductPrice>> MapMultiModel(ProductPriceMultiModel model)
        {
            var categoryId = await _categoryService.GetOrCreateCategoryId(_identity.AccountId, model.CategoryName);
            var companyId = await _companyService.GetOrCreateCompanyId(_identity.AccountId, model.CompanyName);
            var priceDate = DateHelper.ToServer(model.PriceDate)!.Value;
            var result = new List<ProductPrice>();

            foreach (var priceModel in model.Prices)
            {
                var productId = await GetOrCreateProductId(priceModel.ProductName, categoryId);

                var price = new ProductPrice
                {
                    CreatedOn = DateTime.UtcNow,
                    CreatedByUserId = _identity.UserId,
                    ModifiedOn = DateTime.UtcNow,
                    ModifiedByUserId = _identity.UserId,
                    ProductId = productId,
                    CompanyId = companyId,
                    CategoryId = categoryId,
                    PriceDate = priceDate,
                    Price = priceModel.Price,
                    IsDiscount = priceModel.IsDiscount,
                    Quantity = priceModel.Quantity,
                    Description = priceModel.Description
                };

                result.Add(price);
            }

            return result;
        }

        private async Task<int> GetOrCreateProductId(string name, int? categoryId)
        {
            var product = await _productSearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.Name == name);
            if (product == null)
            {
                product = new Product
                {
                    AccountId = _identity.AccountId,
                    Name = name,
                    CategoryId = categoryId
                };

                await _productStore.Insert(product);
            }

            return product.ProductId;
        }
    }
}
