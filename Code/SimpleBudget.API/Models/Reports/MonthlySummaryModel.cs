namespace SimpleBudget.API.Models
{
    public class MonthlySummaryModel
    {
        public string Name { get; set; } = default!;
        public decimal BeginningCAD { get; set; }
        public decimal CurrentCAD { get; set; }
    }
}
