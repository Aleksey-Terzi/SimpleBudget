namespace SimpleBudget.API.Models
{
    public class TaxItemModel
    {
        public string Name { get; set; } = default!;
        public decimal ValueCAD { get; set; }
        public decimal ValuePaidCAD { get; set; }
        public decimal DiffCAD { get; set; }
    }
}
