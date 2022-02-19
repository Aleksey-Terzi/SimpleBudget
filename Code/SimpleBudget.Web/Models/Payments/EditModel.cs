using System.Web;

using SimpleBudget.Data;

namespace SimpleBudget.Web.Models.Payments
{
    public class EditModel
    {
        public int Id { get; set; }
        public int? Page { get; set; }
        public string? Type { get; set; }
        public string? Text { get; set; }
        public string? TextEncoded => HttpUtility.UrlEncode(Text);

        public List<string>? Companies { get; set; }
        public List<string>? Categories { get; set; }
        public List<string>? Wallets { get; set; }
        public List<string>? Persons { get; set; }

        public string PaymentType { get; set; } = default!;
        public string Date { get; set; } = default!;
        public string? Company { get; set; }
        public string? Category { get; set; }
        public string? Wallet { get; set; }
        public string? Description { get; set; }
        public string Value { get; set; } = default!;
        public bool Taxable { get; set; }
        public int? TaxYear { get; set; }
        public string? WalletTo { get; set; }
        public string? ValueTo { get; set; }
        public string? Person { get; set; }

        public bool ShowTaxYearField => PaymentType == "Expenses" && Category == Constants.Category.Taxes;
    }
}