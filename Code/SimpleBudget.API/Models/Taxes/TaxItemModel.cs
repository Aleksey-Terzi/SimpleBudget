namespace SimpleBudget.API.Models
{
    public class TaxItemModel
    {
        public string Name { get; set; } = default!;
        public decimal ValueCAD { get; set; }
        public decimal ValuePaidCAD { get; set; }
        public decimal DiffCAD { get; set; }

        public string FormattedValueCAD { get; set; } = default!;
        public string FormattedValuePaidCAD { get; set; } = default!;
        public string FormattedDiffCAD { get; set; } = default!;
    }
}
