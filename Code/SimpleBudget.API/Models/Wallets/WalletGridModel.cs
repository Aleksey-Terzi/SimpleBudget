namespace SimpleBudget.API.Models
{
    public class WalletGridModel
    {
        public int WalletId { get; set; }
        public string WalletName { get; set; } = default!;
        public string? PersonName { get; set; }
        public string CurrencyCode { get; set; } = default!;
        public int PaymentCount { get; set; }
    }
}
