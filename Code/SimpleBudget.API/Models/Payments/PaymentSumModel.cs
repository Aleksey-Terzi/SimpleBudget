namespace SimpleBudget.API.Models
{
    public class PaymentSumModel
    {
        public string ValueFormat { get; set; } = default!;
        public decimal Sum { get; set; }
    }
}
