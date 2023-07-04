namespace SimpleBudget.API.Models
{
    public class SummaryCurrencyModel
    {
        public string CurrencyCode { get; set; } = default!;
        public string ValueFormat { get; set; } = default!;
        public decimal Value { get; set; }
        public decimal Rate { get; set; }
    }
}
