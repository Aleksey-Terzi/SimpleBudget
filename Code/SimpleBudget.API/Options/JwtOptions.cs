namespace SimpleBudget.API.Options
{
    public class JwtOptions
    {
        public string Key { get; set; } = default!;
        public int ExpiresInHours { get; set; }
    }
}
