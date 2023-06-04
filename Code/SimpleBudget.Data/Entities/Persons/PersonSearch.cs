namespace SimpleBudget.Data
{
    public class PersonSearch : SearchHelper<Person>
    {
        public PersonSearch(BudgetDbContext context) : base(context) { }
    }
}
