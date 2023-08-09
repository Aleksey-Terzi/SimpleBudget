namespace SimpleBudget.API.Models
{
    public class NewImportPaymentModel
    {
        public string Code { get; set; } = default!;
        public string Date { get; set; } = default!;
        public string? Category { get; set; }
        public string? Company { get; set; }
        public decimal Value { get; set; }
        public string? Description { get; set; }
    }
}
