namespace SimpleBudget.Data
{
    public class PlanPaymentStore : StoreHelper<PlanPayment>
    {
        public PlanPaymentStore(BudgetDbContext context) : base(context) { }
    }
}
