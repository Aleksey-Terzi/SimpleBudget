namespace SimpleBudget.API.Models
{
    public class TaxModel
    {
        public List<int> Years { get; set; } = default!;
        public List<TaxPersonModel> Persons { get; set; } = default!;
        public List<TaxIncomeModel> Incomes { get; set; } = default!;
        public List<TaxItemModel> TaxItems { get; set; } = default!;

        public int? SelectedPersonId { get; set; }
        public int SelectedYear { get; set; }
        public bool CanOpen { get; set; }

        public string? Closed { get; set; }

        public string ValueFormatCAD { get; set; } = default!;
    }
}