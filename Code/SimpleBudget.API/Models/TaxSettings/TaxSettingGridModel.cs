namespace SimpleBudget.API.Models
{
    public class TaxSettingGridModel
    {
        public int Year { get; set; }
        public string? CPPRateFormatted { get; set; }
        public string? CPPMaxAmountFormatted { get; set; }
        public string? EIRateFormatted { get; set; }
        public string? EIMaxAmountFormatted { get; set; }
        public string? CPPBasicExemptionAmountFormatted { get; set; }
        public string? FederalBasicPersonalAmountFormatted { get; set; }
        public string? ProvincialBasicPersonalAmountFormatted { get; set; }
        public string? CanadaEmploymentBaseAmountFormatted { get; set; }
    }
}
