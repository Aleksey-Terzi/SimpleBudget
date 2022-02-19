namespace SimpleBudget.Data
{
    public class ReportMonthly
    {
        public class Wallet
        {
            public int WalletId { get; set; }
            public string WalletName { get; set; } = default!;
            public string CurrencyCode { get; set; } = default!;
            public string ValueFormat { get; set; } = default!;
            public decimal Beginning { get; set; }
            public decimal Expenses { get; set; }
            public decimal Income { get; set; }
            public decimal BeginningRate { get; set; }
            public decimal CurrentRate { get; set; }
        }

        public class Category
        {
            public string CategoryName { get; set; } = default!;
            public decimal Value { get; set; }
        }

        public List<Wallet> Wallets { get; set; } = default!;
        public List<Category> Categories { get; set; } = default!;
    }
}
