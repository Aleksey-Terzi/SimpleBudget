using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public abstract class StoreHelper<TEntity> where TEntity: class
    {
        private readonly BudgetDbContext _context;

        protected StoreHelper(BudgetDbContext context)
        {
            _context = context;
        }

        public async Task Insert(TEntity entity)
        {
            _context.Entry(entity).State = EntityState.Added;
            await _context.SaveChangesAsync();
        }

        public async Task Update(TEntity entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task Delete(TEntity entity)
        {
            _context.Entry(entity).State = EntityState.Deleted;
            await _context.SaveChangesAsync();
        }
    }
}
