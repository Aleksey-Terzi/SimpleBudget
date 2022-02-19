namespace SimpleBudget.Web.Models.Currencies
{
    public class EditModel
    {
        public int Id { get; set; }
        public string Code { get; set; } = default!;
        public string ValueFormat { get; set; } = default!;
        public int? PaymentCount { get; set; }

        public string? Error { get; set; }
    }
}
