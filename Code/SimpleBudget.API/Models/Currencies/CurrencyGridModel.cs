namespace SimpleBudget.API.Models
{
    public class CurrencyGridModel
    {
        public int CurrencyId { get; set; }
        public string Code { get; set; } = default!;
        public string ValueFormat { get; set; } = default!;
        public string? MarketStartDate { get; set; }
        public decimal? MarketRate { get; set; }
        public string? BankStartDate { get; set; }
        public decimal? BankRate { get; set; }
    }
}
