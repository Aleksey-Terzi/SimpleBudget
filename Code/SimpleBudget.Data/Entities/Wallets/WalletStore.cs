namespace SimpleBudget.Data
{
    public class WalletStore : StoreHelper<Wallet>
    {
        public WalletStore(BudgetDbContext context) : base(context) { }
    }
}
