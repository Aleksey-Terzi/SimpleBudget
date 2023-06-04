namespace SimpleBudget.Data
{
    public interface IPaymentFilter
    {
        int AccountId { get; set; }
        string? Type { get; set; }
        string? SearchText { get; set; }
        int? PaymentYear { get; set; }
        int? PaymentMonth { get; set; }
        string? Category { get; set; }
    }
}
