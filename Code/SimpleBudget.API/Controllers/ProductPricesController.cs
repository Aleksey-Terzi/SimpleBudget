using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class ProductPricesController : BaseApiController
    {
        private readonly IdentityService _identity;
        private readonly ProductPriceSearchService _searchService;
        private readonly ProductPriceUpdateService _updateService;
        private readonly CurrencySearch _currencySearch;

        public ProductPricesController(
            IdentityService identity,
            ProductPriceSearchService searchService,
            ProductPriceUpdateService updateService,
            CurrencySearch currencySearch
            )
        {
            _identity = identity;
            _searchService = searchService;
            _updateService = updateService;
            _currencySearch = currencySearch;
        }

        [HttpGet]
        public async Task<ActionResult<ProductPriceSearchResult>> SearchProductPrices([FromQuery] ProductPriceFilterModel input)
        {
            var (items, pagination) = await _searchService.Search(input);

            var cad = await _currencySearch.SelectDefault(_identity.AccountId);

            Response.AddPaginationHeader(pagination);

            return new ProductPriceSearchResult
            {
                ValueFormat = cad.ValueFormat,
                Items = items
            };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductPriceEditModel>> GetProductPrice(int id)
        {
            var payment = await _searchService.GetProductPrice(id);

            if (payment == null)
                return BadRequest(new ProblemDetails { Title = "ProductPrice Not Found" });

            return payment;
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateProductPrice(ProductPriceEditModel model)
        {
            return await _updateService.CreateProductPrice(model);
        }

        [HttpPost("multi")]
        public async Task<ActionResult<List<int>>> CreateProductPriceMulti(ProductPriceMultiModel model)
        {
            return await _updateService.CreateProductPriceMulti(model);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProductPrice([FromRoute] int id, ProductPriceEditModel model)
        {
            await _updateService.UpdateProductPrice(id, model);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProductPrice([FromRoute] int id)
        {
            await _updateService.DeleteProductPrice(id);

            return Ok();
        }
    }
}
