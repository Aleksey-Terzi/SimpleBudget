namespace SimpleBudget.Data
{
    public class PlanPaymentFilter : IPaymentFilter
    {
        public int AccountId { get; set; }
        public string? Type { get; set; }
        public string? SearchText { get; set; }
        public int? PaymentYear { get; set; }
        public int? PaymentMonth { get; set; }
        public string? Category { get; set; }
        public bool? IsActive { get; set; }
    }
}
