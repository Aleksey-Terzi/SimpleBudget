namespace SimpleBudget.API.Models
{
    public class CurrencyRateGridModel
    {
        public int CurrencyRateId { get; set; }
        public string StartDate { get; set; } = default!;
        public decimal Rate { get; set; }
        public bool BankOfCanada { get; set; }
    }
}
