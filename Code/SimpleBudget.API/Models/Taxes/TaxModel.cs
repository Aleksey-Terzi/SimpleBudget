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

        public decimal IncomeTotalCAD { get; set; }
        public decimal TaxTotalCAD { get; set; }
        public decimal TaxPaidTotalCAD { get; set; }
        public decimal TaxDiffTotalCAD { get; set; }

        public string FormattedIncomeTotalCAD { get; set; } = default!;
        public string FormattedTaxTotalCAD { get; set; } = default!;
        public string FormattedTaxPaidTotalCAD { get; set; } = default!;
        public string FormattedTaxDiffTotalCAD { get; set; } = default!;

        public string? FormattedClosed { get; set; }
    }
}