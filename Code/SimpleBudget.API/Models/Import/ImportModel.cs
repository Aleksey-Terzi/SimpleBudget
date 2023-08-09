namespace SimpleBudget.API.Models
{
    public class ImportModel
    {
        public string? ValueFormat { get; set; }
        public List<SuggestedPaymentModel>? Payments { get; set; }
        public string? Error { get; set; }
    }
}
