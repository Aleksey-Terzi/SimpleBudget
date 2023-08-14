namespace SimpleBudget.Data
{
    public class PaymentAdvancedFilter
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? StartValue { get; set; }
        public decimal? EndValue { get; set; }
        public string? Keyword { get; set; }
        public string? Company { get; set; }
        public string? Category { get; set; }
        public string? Wallet { get; set; }
    }
}
