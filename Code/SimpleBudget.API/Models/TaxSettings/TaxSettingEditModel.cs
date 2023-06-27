using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class TaxSettingEditModel
    {
        [Required]
        public decimal? CPPRate { get; set; }

        [Required]
        public decimal? CPPMaxAmount { get; set; }

        [Required]
        public decimal? EIRate { get; set; }

        [Required]
        public decimal? EIMaxAmount { get; set; }

        [Required]
        public decimal? CPPBasicExemptionAmount { get; set; }

        [Required]
        public decimal? FederalBasicPersonalAmount { get; set; }

        [Required]
        public decimal? ProvincialBasicPersonalAmount { get; set; }

        [Required]
        public decimal? CanadaEmploymentBaseAmount { get; set; }

        public List<TaxRateModel> FederalTaxRates { get; set; } = default!;
        public List<TaxRateModel> ProvincialTaxRates { get; set; } = default!;
    }
}
