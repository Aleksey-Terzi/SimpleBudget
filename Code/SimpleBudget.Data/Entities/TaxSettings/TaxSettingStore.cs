namespace SimpleBudget.Data
{
    public class TaxSettingStore : StoreHelper<TaxSetting>
    {
        public TaxSettingStore(BudgetDbContext context) : base(context) { }
    }
}
