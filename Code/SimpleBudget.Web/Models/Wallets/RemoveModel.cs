namespace SimpleBudget.Web.Models.Wallets
{
    public class RemoveModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? PersonName { get; set; }
        public string CurrencyCode { get; set; } = default!;
        public int? PaymentCount { get; set; }
    }
}
