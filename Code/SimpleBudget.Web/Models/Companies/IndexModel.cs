namespace SimpleBudget.Web.Models.Companies
{
    public class IndexModel
    {
        public class Item
        {
            public int CompanyId { get; set; }
            public string Name { get; set; } = default!;
            public int PaymentCount { get; set; }
        }

        public List<Item> Items { get; set; } = default!;
    }
}
