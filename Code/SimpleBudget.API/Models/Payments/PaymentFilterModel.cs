namespace SimpleBudget.API.Models
{
    public class PaymentFilterModel
    {
        public int? Id { get; set; }
        public int? Page { get; set; }
        public string? Text { get; set; }
        public string? Type { get; set; }
    }
}
