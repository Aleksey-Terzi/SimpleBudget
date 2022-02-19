namespace SimpleBudget.Web.Models.Currencies
{
    public class RemoveModel
    {
        public int Id { get; set; }
        public string Code { get; set; } = default!;
        public int WalletCount { get; set; }
    }
}
