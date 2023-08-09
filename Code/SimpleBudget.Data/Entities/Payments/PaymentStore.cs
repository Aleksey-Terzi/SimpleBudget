namespace SimpleBudget.Data
{
    public class PaymentStore : StoreHelper<Payment>
    {
        public PaymentStore(BudgetDbContext context) : base(context) { }

        public async Task InsertMany(List<Payment> payments)
        {
            await Context.Payments.AddRangeAsync(payments);
            await Context.SaveChangesAsync();
        }
    }
}
