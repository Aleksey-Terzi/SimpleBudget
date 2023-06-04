namespace SimpleBudget.API.Models
{
    public class CompanyGridModel
    {
        public int CompanyId { get; set; }
        public string Name { get; set; } = default!;
        public int PaymentCount { get; set; }
    }
}
