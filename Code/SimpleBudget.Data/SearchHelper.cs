using System.Data.Entity;
using System.Linq.Expressions;

namespace SimpleBudget.Data
{
    public abstract class SearchHelper<TEntity> where TEntity : class
    {
        public List<TEntity> Select(
            Expression<Func<TEntity, bool>> filter,
            Func<IQueryable<TEntity>, IQueryable<TEntity>>? process = null,
            params Expression<Func<TEntity, object>>[] includes)
        {
            return ExecuteQuery(query => BuildQuery(query, x => x, filter, includes, process).ToList());
        }

        public TEntity? SelectFirst(
            Expression<Func<TEntity, bool>> filter,
            params Expression<Func<TEntity, object>>[] includes)
        {
            return ExecuteQuery(query => BuildQuery(query, x => x, filter, includes, null).FirstOrDefault());
        }

        public List<T> Bind<T>(
            Expression<Func<TEntity, T>> binder,
            Expression<Func<TEntity, bool>> filter,
            Func<IQueryable<T>, IQueryable<T>>? process = null)
        {
            return ExecuteQuery(query => BuildQuery(query, binder, filter, null, process).ToList());
        }

        public T? BindFirst<T>(
            Expression<Func<TEntity, T>> binder,
            Expression<Func<TEntity, bool>> filter,
            Func<IQueryable<T>, IQueryable<T>>? process = null)
        {
            return ExecuteQuery(query => BuildQuery(query, binder, filter, null, process).FirstOrDefault());
        }

        public int Count(Expression<Func<TEntity, bool>> filter)
        {
            return Count(query => filter != null ? query.Where(filter) : query);
        }

        protected int Count(Func<IQueryable<TEntity>, IQueryable<TEntity>> filter)
        {
            return ExecuteQuery(query => filter(query).Count());
        }

        public bool Exists(Expression<Func<TEntity, bool>> filter)
        {
            return Exists(query => filter != null ? query.Where(filter) : query);
        }

        protected bool Exists(Func<IQueryable<TEntity>, IQueryable<TEntity>> filter)
        {
            return ExecuteQuery(query => filter(query).Any());
        }

        protected TResult ExecuteQuery<TResult>(Func<IQueryable<TEntity>, TResult> func)
        {
            using (var db = new BudgetDbContext())
            {
                db.Configuration.ProxyCreationEnabled = false;

                var query = db.Set<TEntity>().AsQueryable().AsNoTracking();

                return func(query);
            }
        }

        protected IQueryable<T> BuildQuery<T>(
            IQueryable<TEntity> query,
            Expression<Func<TEntity, T>> binder,
            Expression<Func<TEntity, bool>> filter,
            Expression<Func<TEntity, object>>[]? includes,
            Func<IQueryable<T>, IQueryable<T>>? process
            )
        {
            return BuildQuery(
                query,
                q => q.Select(binder),
                q => filter != null ? q.Where(filter) : q,
                q =>
                {
                    if (includes != null && includes.Length > 0)
                        foreach (var include in includes)
                            query = query.Include(include);

                    return query;
                },
                process
            );
        }

        protected IQueryable<T> BuildQuery<T>(
            IQueryable<TEntity> inputQuery,
            Func<IQueryable<TEntity>, IQueryable<T>> bind,
            Func<IQueryable<TEntity>, IQueryable<TEntity>> filter,
            Func<IQueryable<TEntity>, IQueryable<TEntity>> include,
            Func<IQueryable<T>, IQueryable<T>>? process)
        {
            var filteredQuery = filter(include(inputQuery));
            var resultQuery = bind(filteredQuery);

            if (process != null)
                resultQuery = process(resultQuery);

            return resultQuery;
        }
    }
}
