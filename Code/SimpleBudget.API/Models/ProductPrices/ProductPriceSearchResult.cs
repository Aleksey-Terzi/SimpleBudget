namespace SimpleBudget.API.Models
{
    public class ProductPriceSearchResult
    {
        public string ValueFormat { get; set; } = default!;
        public ProductPriceGridModel[] Items { get; set; } = default!;
    }
}
