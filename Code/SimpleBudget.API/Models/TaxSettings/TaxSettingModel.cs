namespace SimpleBudget.API.Models
{
    public class TaxSettingModel
    {
        public string ValueFormat { get; set; } = default!;
        public List<TaxSettingGridModel> Items { get; set; } = default!;
    }
}
