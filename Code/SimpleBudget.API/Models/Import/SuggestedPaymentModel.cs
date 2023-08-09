namespace SimpleBudget.API.Models
{
    public class SuggestedPaymentModel
    {
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Date { get; set; } = default!;
        public string? Category { get; set; }
        public string? Company { get; set; }
        public decimal Value { get; set; }
    }
}
