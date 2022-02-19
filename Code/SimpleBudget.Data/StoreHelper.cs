using System.Data.Entity;

namespace SimpleBudget.Data
{
    public abstract class StoreHelper<TEntity> where TEntity: class
    {
        public void Insert(TEntity entity)
        {
            using (var db = new BudgetDbContext())
            {
                db.Entry(entity).State = EntityState.Added;
                db.SaveChanges();
            }
        }

        public void Update(TEntity entity)
        {
            using (var db = new BudgetDbContext())
            {
                db.Entry(entity).State = EntityState.Modified;
                db.SaveChanges();
            }
        }

        public void Delete(TEntity entity)
        {
            using (var db = new BudgetDbContext())
            {
                db.Entry(entity).State = EntityState.Deleted;
                db.SaveChanges();
            }
        }
    }
}
