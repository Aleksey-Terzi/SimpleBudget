using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class CategorySearch
    {
        private readonly BudgetDbContext _context;

        public CategorySearch(BudgetDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsAsync(Expression<Func<Category, bool>>? filter)
        {
            var query = _context.Categories.AsQueryable();

            if (filter != null)
                query = query.Where(filter);

            return await query.AnyAsync();
        }

        public async Task<T?> GetAsync<T>(
            Expression<Func<Category, T>> select,
            Expression<Func<Category, bool>>? filter
            )
        {
            var query = _context.Categories.AsQueryable();

            if (filter != null)
                query = query.Where(filter);

            return await query.Select(select).FirstOrDefaultAsync();
        }

        public async Task<List<T>> GetListAsync<T>(
            Expression<Func<Category, T>> select,
            Expression<Func<Category, bool>>? filter
            )
        {
            var query = _context.Categories.AsQueryable();

            if (filter != null)
                query = query.Where(filter);

            return await query.Select(select).ToListAsync();
        }
    }
}
