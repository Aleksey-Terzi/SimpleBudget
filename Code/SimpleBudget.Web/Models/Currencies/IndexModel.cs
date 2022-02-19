namespace SimpleBudget.Web.Models.Currencies
{
    public class IndexModel
    {
        public class RateItem
        {
            public DateTime StartDate { get; set; }
            public decimal Rate { get; set; }
        }

        public class Item
        {
            public int CurrencyId { get; set; }
            public string Code { get; set; } = default!;
            public string ValueFormat { get; set; } = default!;
            public int WalletCount { get; set; }
            public RateItem? LatestActualRate { get; set; }
            public RateItem? LatestOfficialRate { get; set; }
        }

        public Item[] Items { get; set; } = default!;
    }
}
