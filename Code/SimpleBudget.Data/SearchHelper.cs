using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public abstract class SearchHelper<TEntity> where TEntity : class
    {
        private readonly BudgetDbContext _context;

        protected BudgetDbContext Context => _context;

        protected SearchHelper(BudgetDbContext context)
        {
            _context = context;
        }

        public async Task<List<TEntity>> Select(
            Expression<Func<TEntity, bool>> filter,
            Func<IQueryable<TEntity>, IQueryable<TEntity>>? process = null,
            params Expression<Func<TEntity, object>>[] includes)
        {
            return await ExecuteQuery(async query => await BuildQuery(query, x => x, filter, includes, process).ToListAsync());
        }

        public async Task<TEntity?> SelectFirst(
            Expression<Func<TEntity, bool>> filter,
            params Expression<Func<TEntity, object>>[] includes)
        {
            return await ExecuteQuery(async query => await BuildQuery(query, x => x, filter, includes, null).FirstOrDefaultAsync());
        }

        public async Task<List<T>> Bind<T>(
            Expression<Func<TEntity, T>> binder,
            Expression<Func<TEntity, bool>> filter,
            Func<IQueryable<T>, IQueryable<T>>? process = null)
        {
            return await ExecuteQuery(async query => await BuildQuery(query, binder, filter, null, process).ToListAsync());
        }

        public async Task<T?> BindFirst<T>(
            Expression<Func<TEntity, T>> binder,
            Expression<Func<TEntity, bool>> filter,
            Func<IQueryable<T>, IQueryable<T>>? process = null)
        {
            return await ExecuteQuery(async query => await BuildQuery(query, binder, filter, null, process).FirstOrDefaultAsync());
        }

        public async Task<int> Count(Expression<Func<TEntity, bool>> filter)
        {
            return await Count(query => filter != null ? query.Where(filter) : query);
        }

        protected async Task<int> Count(Func<IQueryable<TEntity>, IQueryable<TEntity>> filter)
        {
            return await ExecuteQuery(async query => await filter(query).CountAsync());
        }

        public async Task<bool> Exists(Expression<Func<TEntity, bool>> filter)
        {
            return await Exists(query => filter != null ? query.Where(filter) : query);
        }

        protected async Task<bool> Exists(Func<IQueryable<TEntity>, IQueryable<TEntity>> filter)
        {
            return await ExecuteQuery(async query => await filter(query).AnyAsync());
        }

        protected async Task<TResult> ExecuteQuery<TResult>(Func<IQueryable<TEntity>, Task<TResult>> func)
        {
            var query = _context.Set<TEntity>().AsQueryable().AsNoTracking();

            return await func(query);
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
