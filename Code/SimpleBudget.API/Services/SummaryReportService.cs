using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class SummaryReportService
    {
        private readonly IdentityService _identity;
        private readonly UnpaidTaxService _unpaidTaxService;
        private readonly ReportSearch _reportSearch;
        private readonly CurrencySearch _currencySearch;

        public SummaryReportService(
            IdentityService identity,
            UnpaidTaxService unpaidTaxService,
            ReportSearch reportSearch,
            CurrencySearch currencySearch
            )
        {
            _identity = identity;
            _unpaidTaxService = unpaidTaxService;
            _reportSearch = reportSearch;
            _currencySearch = currencySearch;
        }

        public async Task<SummaryModel> CreateAsync()
        {
            var data = await _reportSearch.SelectWalletSummary(_identity.AccountId);
            var cad = await _currencySearch.SelectDefault(_identity.AccountId);

            if (cad == null)
                throw new ArgumentException($"CAD currency is not found");

            var model = new SummaryModel();

            model.Wallets = data.Select(x => new SummaryWalletModel
            {
                WalletName = x.WalletName,
                CurrencyCode = x.CurrencyCode,
                Value = x.Value,
                ValueFormat = x.ValueFormat,
                Rate = x.Rate,
            }).ToList();

            model.Currencies = data
                .GroupBy(x => new { x.CurrencyCode, x.ValueFormat, x.Rate })
                .Select(x => {
                    var value = x.Sum(y => y.Value);

                    return new SummaryCurrencyModel
                    {
                        CurrencyCode = x.Key.CurrencyCode,
                        Value = value,
                        ValueFormat = x.Key.ValueFormat,
                        Rate = x.Key.Rate,
                    };
                }).ToList();

            var totalValue = data.Count > 0 ? data.Sum(x => x.Value * x.Rate) : 0;
            var tax = await _unpaidTaxService.CalculateUnpaidTaxAsync(TimeHelper.GetLocalTime().Year, null, null);

            model.TaxCAD = tax;
            model.ValueFormatCAD = cad.ValueFormat;

            return model;
        }
    }
}
