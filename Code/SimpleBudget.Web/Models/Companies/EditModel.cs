namespace SimpleBudget.Web.Models.Companies
{
    public class EditModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public int? PaymentCount { get; set; }

        public string? Error { get; set; }
    }
}
