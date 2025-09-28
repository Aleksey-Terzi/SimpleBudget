using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class CategoryService
    {
        private readonly CategorySearch _categorySearch;
        private readonly CategoryStore _categoryStore;

        public CategoryService(CategorySearch categorySearch, CategoryStore categoryStore)
        {
            _categorySearch = categorySearch;
            _categoryStore = categoryStore;
        }

        public async Task<int?> GetOrCreateCategoryId(int accountId, string? name)
        {
            if (string.IsNullOrEmpty(name))
                return null;

            var categoryId = await _categorySearch.GetAsync(
                x => (int?)x.CategoryId,
                x => x.AccountId == accountId && x.Name == name
            );

            if (categoryId != null)
                return categoryId;

            var category = new Category
            {
                AccountId = accountId,
                Name = name
            };

            await _categoryStore.InsertAsync(category);

            return category.CategoryId;
        }
    }
}
