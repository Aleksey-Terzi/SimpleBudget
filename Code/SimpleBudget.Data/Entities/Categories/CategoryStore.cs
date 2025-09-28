using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class CategoryStore
    {
        private readonly BudgetDbContext _context;

        public CategoryStore(BudgetDbContext context)
        {
            _context = context;
        }

        public async Task InsertAsync(Category entity)
        {
            await _context.Categories.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Category entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Category entity)
        {
            _context.Entry(entity).State = EntityState.Deleted;
            await _context.SaveChangesAsync();
        }
    }
}
