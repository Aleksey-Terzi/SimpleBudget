using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class CategoriesController : BaseApiController
    {
        private readonly IdentityService _identity;
        private readonly CategorySearch _categorySearch;
        private readonly CategoryStore _categoryStore;
        private readonly PaymentSearch _paymentSearch;

        public CategoriesController(
            IdentityService identity,
            CategorySearch categorySearch,
            CategoryStore categoryStore,
            PaymentSearch paymentSearch
            )
        {
            _identity = identity;
            _categorySearch = categorySearch;
            _categoryStore = categoryStore;
            _paymentSearch = paymentSearch;
        }

        [HttpGet]
        public async Task<ActionResult<List<CategoryGridModel>>> GetCategories()
        {
            var categories = await _categorySearch.Bind(
                x => new CategoryGridModel
                {
                    CategoryId = x.CategoryId,
                    Name = x.Name,
                    PaymentCount = x.Payments.Count
                },
                x => x.AccountId == _identity.AccountId
            );

            return categories.OrderBy(x => x.Name).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryEditModel>> GetCategory(int id)
        {
            var category = await _categorySearch.SelectFirst(x => x.CategoryId == id && x.AccountId == _identity.AccountId);
            if (category == null)
                return BadRequest(new ProblemDetails { Title = "Category doesn't exist" });

            var paymentCount = await _paymentSearch.Count(x => x.CategoryId == id);

            return new CategoryEditModel
            {
                Name = category.Name,
                PaymentCount = paymentCount
            };
        }

        [HttpGet("exists")]
        public async Task<ActionResult<bool>> CategoryExists(string name, int? excludeId)
        {
            var item = await _categorySearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.Name == name);
            return item != null && item.CategoryId != excludeId;
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateCategory(CategoryEditModel model)
        {
            if (await _categorySearch.Exists(x => x.AccountId == _identity.AccountId && x.Name == model.Name))
                return BadRequest(new ProblemDetails { Title = "The category with such a name already exists" });

            var category = new Category
            {
                AccountId = _identity.AccountId,
                Name = model.Name
            };

            await _categoryStore.Insert(category);

            return category.CategoryId;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategory(int id, CategoryEditModel model)
        {
            var category = await _categorySearch.SelectFirst(x => x.CategoryId == id && x.AccountId == _identity.AccountId);
            if (category == null)
                return BadRequest(new ProblemDetails { Title = "Category doesn't exist" });

            category.Name = model.Name;

            await _categoryStore.Update(category);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await _categorySearch.SelectFirst(x => x.CategoryId == id && x.AccountId == _identity.AccountId);
            if (category == null)
                return BadRequest(new ProblemDetails { Title = "Category doesn't exist" });

            if (await _paymentSearch.Exists(x => x.CategoryId == id))
                return BadRequest(new ProblemDetails { Title = "Category has payments" });

            await _categoryStore.Delete(category);

            return Ok();
        }
    }
}
