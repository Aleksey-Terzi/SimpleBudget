namespace SimpleBudget.Data
{
    public class TaxSettingSearch : SearchHelper<TaxSetting>
    {
        public TaxSettingSearch(BudgetDbContext context) : base(context) { }
    }
}
