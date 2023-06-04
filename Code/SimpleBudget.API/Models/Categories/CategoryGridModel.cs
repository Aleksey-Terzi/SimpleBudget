namespace SimpleBudget.API.Models
{
    public class CategoryGridModel
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = default!;
        public int PaymentCount { get; set; }
    }
}
