namespace SimpleBudget.API.Models
{
    public class TaxSettingGridModel
    {
        public int Year { get; set; }
        public decimal? CPPRate { get; set; }
        public decimal? CPPMaxAmount { get; set; }
        public decimal? EIRate { get; set; }
        public decimal? EIMaxAmount { get; set; }
        public decimal? CPPBasicExemptionAmount { get; set; }
        public decimal? FederalBasicPersonalAmount { get; set; }
        public decimal? ProvincialBasicPersonalAmount { get; set; }
        public decimal? CanadaEmploymentBaseAmount { get; set; }
    }
}
