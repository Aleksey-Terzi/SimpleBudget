using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class ProductsController : BaseApiController
    {
        private readonly IdentityService _identity;
        private readonly ProductSearch _productSearch;
        private readonly ProductStore _productStore;
        private readonly ProductPriceSearch _productPriceSearch;
        private readonly CategoryService _categoryService;

        public ProductsController(
            IdentityService identity,
            ProductSearch productSearch,
            ProductStore productStore,
            ProductPriceSearch productPriceSearch,
            CategoryService categoryService
            )
        {
            _identity = identity;
            _productSearch = productSearch;
            _productStore = productStore;
            _productPriceSearch = productPriceSearch;
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductGridModel>>> GetProducts()
        {
            var products = await _productSearch.Bind(
                x => new ProductGridModel
                {
                    ProductId = x.ProductId,
                    ProductName = x.Name,
                    CategoryName = x.Category!.Name,
                    PriceCount = x.ProductPrices.Count
                },
                x => x.AccountId == _identity.AccountId,
                q => q.OrderBy(x => x.ProductName)
            );

            return products;
        }

        [HttpGet("selector")]
        public async Task<ActionResult<List<ProductSelectorModel>>> GetSelectorProducts()
        {
            var products = await _productSearch.Bind(
                x => new ProductSelectorModel
                {
                    ProductName = x.Name,
                    CategoryName = x.Category!.Name,
                },
                x => x.AccountId == _identity.AccountId,
                q => q.OrderBy(x => x.ProductName)
            );

            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductEditModel>> GetProduct(int id)
        {
            var product = await _productSearch.SelectFirst(x => x.ProductId == id && x.AccountId == _identity.AccountId, x => x.Category!);
            if (product == null)
                return BadRequest(new ProblemDetails { Title = "Product doesn't exist" });

            var priceCount = await _productPriceSearch.Count(x => x.ProductId == id);

            return new ProductEditModel
            {
                ProductName = product.Name,
                CategoryName = product.Category?.Name,
                PriceCount = priceCount
            };
        }

        [HttpGet("exists")]
        public async Task<ActionResult<bool>> ProductExists(string name, int? excludeId)
        {
            var product = await _productSearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.Name == name);
            return product != null && product.ProductId != excludeId;
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateProduct(ProductEditModel model)
        {
            if (await _productSearch.Exists(x => x.AccountId == _identity.AccountId && x.Name == model.ProductName))
                return BadRequest(new ProblemDetails { Title = "The product with such a name already exists" });

            var product = new Product
            {
                AccountId = _identity.AccountId,
                CategoryId = await _categoryService.GetOrCreateCategoryId(_identity.AccountId, model.CategoryName),
                Name = model.ProductName
            };

            await _productStore.Insert(product);

            return product.ProductId;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(int id, ProductEditModel model)
        {
            var product = await _productSearch.SelectFirst(x => x.ProductId == id && x.AccountId == _identity.AccountId);
            if (product == null)
                return BadRequest(new ProblemDetails { Title = "Product doesn't exist" });

            if (!string.Equals(product.Name, model.ProductName, StringComparison.OrdinalIgnoreCase)
                && await _productSearch.Exists(x => x.AccountId == _identity.AccountId && x.Name == model.ProductName)
                )
            {
                return BadRequest(new ProblemDetails { Title = "The product with such a name already exists" });
            }

            product.Name = model.ProductName;
            product.CategoryId = await _categoryService.GetOrCreateCategoryId(_identity.AccountId, model.CategoryName);

            await _productStore.Update(product);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _productSearch.SelectFirst(x => x.ProductId == id && x.AccountId == _identity.AccountId);
            if (product == null)
                return BadRequest(new ProblemDetails { Title = "Product doesn't exist" });

            if (await _productPriceSearch.Exists(x => x.ProductId == id))
                return BadRequest(new ProblemDetails { Title = "Product has price records" });

            await _productStore.Delete(product);

            return Ok();
        }
    }
}
