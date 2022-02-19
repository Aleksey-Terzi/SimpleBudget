using System.Web;

using SimpleBudget.Data;

namespace SimpleBudget.Web.Models.PlanPayments
{
    public class EditModel
    {
        public int Id { get; set; }
        public int? Page { get; set; }
        public string? Type { get; set; }
        public string? Text { get; set; }
        public string? TextEncoded => HttpUtility.UrlEncode(Text);

        public List<string> Companies { get; set; } = default!;
        public List<string> Categories { get; set; } = default!;
        public List<string> Wallets { get; set; } = default!;
        public List<string> Persons { get; set; } = default!;

        public bool IsActive { get; set; }
        public string PaymentType { get; set; } = default!;
        public string StartDate { get; set; } = default!;
        public string? EndDate { get; set; }
        public string? Company { get; set; }
        public string? Category { get; set; }
        public string Wallet { get; set; } = default!;
        public string? Description { get; set; }
        public string Value { get; set; } = default!;
        public bool Taxable { get; set; }
        public int? TaxYear { get; set; }
        public string? Person { get; set; }

        public bool ShowTaxYearField => PaymentType == "Expenses" && Category == Constants.Category.Taxes;
    }
}
