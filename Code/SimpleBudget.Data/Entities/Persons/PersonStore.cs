namespace SimpleBudget.Data
{
    public class PersonStore : StoreHelper<Person>
    {
        public PersonStore(BudgetDbContext context) : base(context) { }
    }
}
