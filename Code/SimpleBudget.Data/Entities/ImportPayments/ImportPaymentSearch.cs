namespace SimpleBudget.Data
{
    public class ImportPaymentSearch : SearchHelper<ImportPayment>
    {
        public ImportPaymentSearch(BudgetDbContext context) : base(context) { }
    }
}
