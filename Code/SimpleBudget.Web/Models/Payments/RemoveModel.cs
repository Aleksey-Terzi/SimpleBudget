using System.Web;

namespace SimpleBudget.Web.Models.Payments
{
    public class RemoveModel
    {
        public int Id { get; set; }
        public string? Type { get; set; }
        public string? Text { get; set; }
        public string? TextEncoded => HttpUtility.UrlEncode(Text);

        public string? PaymentType { get; set; }
        public string? Date { get; set; }
        public string? Company { get; set; }
        public string? Category { get; set; }
        public string? Wallet { get; set; }
        public string? Description { get; set; }
        public string? Value { get; set; }
        public string? WalletTo { get; set; }
        public string? ValueTo { get; set; }
    }
}
