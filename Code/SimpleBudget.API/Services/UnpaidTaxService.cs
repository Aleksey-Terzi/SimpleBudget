using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class UnpaidTaxService
    {
        private readonly TaxService _taxService;
        private readonly PersonSearch _personSearch;
        private readonly TaxYearSearch _taxYearSearch;

        public UnpaidTaxService(
            TaxService taxService,
            PersonSearch personSearch,
            TaxYearSearch taxYearSearch
            )
        {
            _taxService = taxService;
            _personSearch = personSearch;
            _taxYearSearch = taxYearSearch;
        }

        public async Task<decimal> CalculateUnpaidTaxAsync(int accountId, int year, int? limitMonth, DateTime? limitTaxPaymentDate)
        {
            if (year < 2020)
                return 0;

            var tax = 0m;
            var persons = await _personSearch.Select(x => x.AccountId == accountId);

            foreach (var person in persons)
            {
                tax += await GetTotalTaxNotPaidAsync(accountId, person.PersonId, year, limitMonth, limitTaxPaymentDate);

                if (year > 2020)
                    tax += await GetTotalTaxNotPaidAsync(accountId, person.PersonId, year - 1, null, limitTaxPaymentDate);
            }

            return tax;
        }

        private async Task<decimal> GetTotalTaxNotPaidAsync(int accountId, int personId, int year, int? limitMonth, DateTime? limitTaxPaymentDate)
        {
            var taxYearEntity = await _taxYearSearch.SelectFirst(x => x.PersonId == personId && x.Year == year);

            if (taxYearEntity != null && (limitTaxPaymentDate == null || taxYearEntity.Closed <= limitTaxPaymentDate))
                return 0;

            var taxes = await _taxService.CreateModelAsync(accountId, personId, year, limitMonth, limitTaxPaymentDate);

            return taxes.TaxTotalCAD > taxes.TaxPaidTotalCAD ? taxes.TaxTotalCAD - taxes.TaxPaidTotalCAD : 0;
        }
    }
}
