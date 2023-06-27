namespace SimpleBudget.API.Middleware
{
    public class IdentityMiddleware
    {
        private readonly RequestDelegate _next;

        public IdentityMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public Task InvokeAsync(HttpContext context, IdentityService identityService)
        {
            identityService.HttpContext = context;
            return _next(context);
        }
    }
}
