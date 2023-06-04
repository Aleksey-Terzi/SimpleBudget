namespace SimpleBudget.API.Models
{
    public class MonthlySummaryModel
    {
        public string Name { get; set; } = default!;
        public decimal BeginningCAD { get; set; }
        public decimal CurrentCAD { get; set; }
        public decimal DiffCAD { get; set; }

        public string FormattedBeginningCAD { get; set; } = default!;
        public string FormattedCurrentCAD { get; set; } = default!;
        public string FormattedDiffCAD { get; set; } = default!;
    }
}
