namespace SimpleBudget.Web.Models.Categories
{
    public class RemoveModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public int PaymentCount { get; set; }
    }
}
