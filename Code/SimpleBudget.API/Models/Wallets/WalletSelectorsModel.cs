namespace SimpleBudget.API.Models
{
    public class WalletSelectorsModel
    {
        public List<ItemModel> Persons { get; set; } = default!;
        public List<ItemModel> Currencies { get; set; } = default!;
    }
}
