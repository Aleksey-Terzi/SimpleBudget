namespace SimpleBudget.Web.Models.Wallets
{
    public class IndexModel
    {
        public class Item
        {
            public int WalletId { get; set; }
            public string WalletName { get; set; } = default!;
            public string? PersonName { get; set; }
            public string CurrencyCode { get; set; } = default!;
            public int PaymentCount { get; set; }
        }

        public List<Item> Items { get; set; } = default!;
    }
}
