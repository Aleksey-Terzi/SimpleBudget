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
                ValueCAD = x.Value * x.Rate,
                FormattedRate = FormatHelper.FormatRate(x.Rate),
                FormattedValue = FormatHelper.FormatValue(x.Value, x.ValueFormat),
                FormattedValueCAD = FormatHelper.FormatValue(x.Value * x.Rate, cad.ValueFormat),
            }).ToList();

            model.Currencies = data
                .GroupBy(x => new { x.CurrencyCode, x.ValueFormat, x.Rate })
                .Select(x => {
                    var value = x.Sum(y => y.Value);

                    return new SummaryCurrencyModel
                    {
                        CurrencyCode = x.Key.CurrencyCode,
                        ValueCAD = value * x.Key.Rate,
                        FormattedRate = FormatHelper.FormatRate(x.Key.Rate),
                        FormattedValue = FormatHelper.FormatValue(value, x.Key.ValueFormat),
                        FormattedValueCAD = FormatHelper.FormatValue(value * x.Key.Rate, cad.ValueFormat)
                    };
                }).ToList();

            var totalValue = data.Count > 0 ? data.Sum(x => x.Value * x.Rate) : 0;
            var tax = await _unpaidTaxService.CalculateUnpaidTaxAsync(TimeHelper.GetLocalTime().Year, null, null);

            model.TaxCAD = tax;
            model.FormattedTotalValue = FormatHelper.FormatValue(totalValue, cad.ValueFormat);
            model.FormattedTax = FormatHelper.FormatValue(tax, cad.ValueFormat);
            model.FormattedTotalTaxDifference = FormatHelper.FormatValue(totalValue - tax, cad.ValueFormat);

            return model;
        }
    }
}
