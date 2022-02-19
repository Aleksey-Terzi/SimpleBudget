namespace SimpleBudget.Web.Models.Categories
{
    public class IndexModel
    {
        public class Item
        {
            public int CategoryId { get; set; }
            public string Name { get; set; } = default!;
            public int PaymentCount { get; set; }
        }

        public List<Item> Items { get; set; } = default!;
    }
}
