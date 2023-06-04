namespace SimpleBudget.Data
{
    public class PaymentStore : StoreHelper<Payment>
    {
        public PaymentStore(BudgetDbContext context) : base(context) { }
    }
}
