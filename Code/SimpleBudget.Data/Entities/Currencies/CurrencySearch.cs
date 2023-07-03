namespace SimpleBudget.Data
{
    public class CurrencySearch : SearchHelper<Currency>
    {
        public CurrencySearch(BudgetDbContext context) : base(context) { }

        public async Task<Currency> SelectDefault(int accountId)
        {
            return (await SelectFirst(x => x.AccountId == accountId && x.Code == "CAD"))!;
        }
    }
}
