using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class UnpaidTaxService
    {
        private readonly IdentityService _identity;
        private readonly TaxService _taxService;
        private readonly PersonSearch _personSearch;
        private readonly TaxYearSearch _taxYearSearch;

        public UnpaidTaxService(
            IdentityService identity,
            TaxService taxService,
            PersonSearch personSearch,
            TaxYearSearch taxYearSearch
            )
        {
            _identity = identity;
            _taxService = taxService;
            _personSearch = personSearch;
            _taxYearSearch = taxYearSearch;
        }

        public async Task<decimal> CalculateUnpaidTaxAsync(int year, int? limitMonth, DateTime? limitTaxPaymentDate)
        {
            if (year < 2020)
                return 0;

            var tax = 0m;
            var persons = await _personSearch.Select(x => x.AccountId == _identity.AccountId);

            foreach (var person in persons)
            {
                tax += await GetTotalTaxNotPaidAsync(person.PersonId, year, limitMonth, limitTaxPaymentDate);

                if (year > 2020)
                    tax += await GetTotalTaxNotPaidAsync(person.PersonId, year - 1, null, limitTaxPaymentDate);
            }

            return tax;
        }

        private async Task<decimal> GetTotalTaxNotPaidAsync(int personId, int year, int? limitMonth, DateTime? limitTaxPaymentDate)
        {
            var taxYearEntity = await _taxYearSearch.SelectFirst(x => x.PersonId == personId && x.Year == year);

            if (taxYearEntity != null && (limitTaxPaymentDate == null || taxYearEntity.Closed <= limitTaxPaymentDate))
                return 0;

            var taxes = await _taxService.CreateModelAsync(personId, year, limitMonth, limitTaxPaymentDate);

            var taxTotalCAD = taxes.TaxItems.Sum(x => x.ValueCAD);
            var taxPaidTotalCAD = taxes.TaxItems.Sum(x => x.ValuePaidCAD);

            return taxTotalCAD > taxPaidTotalCAD ? taxTotalCAD - taxPaidTotalCAD : 0;
        }
    }
}
