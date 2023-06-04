namespace SimpleBudget.Data
{
    public class WalletSearch : SearchHelper<Wallet>
    {
        public WalletSearch(BudgetDbContext context) : base(context) { }
    }
}
