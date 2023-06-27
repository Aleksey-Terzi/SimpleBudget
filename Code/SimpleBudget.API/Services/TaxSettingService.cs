using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class TaxSettingService
    {
        private readonly IdentityService _identity;
        private readonly TaxRateSearch _taxRateSearch;
        private readonly TaxRateStore _taxRateStore;
        private readonly TaxSettingSearch _taxSettingSearch;
        private readonly TaxSettingStore _taxSettingStore;
        private readonly CurrencySearch _currencySearch;

        public TaxSettingService(
            IdentityService identity,
            TaxRateSearch taxRateSearch,
            TaxRateStore taxRateStore,
            TaxSettingSearch taxSettingSearch,
            TaxSettingStore taxSettingStore,
            CurrencySearch currencySearch
            )
        {
            _identity = identity;
            _taxRateSearch = taxRateSearch;
            _taxRateStore = taxRateStore;
            _taxSettingSearch = taxSettingSearch;
            _taxSettingStore = taxSettingStore;
            _currencySearch = currencySearch;
        }

        public async Task<List<TaxSettingGridModel>> GetTaxSettings()
        {
            var currency = await _currencySearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.Code == "CAD");
            var valueFormat = currency?.ValueFormat ?? "${0:n2}";
            var settings = await _taxSettingSearch.Select(x => x.AccountId == _identity.AccountId);
            var rates = await _taxRateSearch.Select(x => x.AccountId == _identity.AccountId && (x.Name == Constants.Tax.CPP || x.Name == Constants.Tax.EI));

            var years = rates
                .Select(x => x.PeriodYear)
                .Distinct()
                .OrderByDescending(x => x);

            var items = new List<TaxSettingGridModel>();

            foreach (var year in years)
            {
                var cpp = rates.Find(x => x.PeriodYear == year && x.Name == Constants.Tax.CPP);
                var ei = rates.Find(x => x.PeriodYear == year && x.Name == Constants.Tax.EI);
                var cppBasicExemptionAmount = settings.Find(x => x.PeriodYear == year && x.Name == Constants.Tax.CPPBasicExemptionAmount)?.Value;
                var federalBasicPersonalAmount = settings.Find(x => x.PeriodYear == year && x.Name == Constants.Tax.FederalBasicPersonalAmount)?.Value;
                var provincialBasicPersonalAmount = settings.Find(x => x.PeriodYear == year && x.Name == Constants.Tax.AlbertaBasicPersonalAmount)?.Value;
                var canadaEmploymentBaseAmount = settings.Find(x => x.PeriodYear == year && x.Name == Constants.Tax.CanadaEmploymentBaseAmount)?.Value;

                var item = new TaxSettingGridModel
                {
                    Year = year,
                    CPPRateFormatted = FormatHelper.FormatPercent(cpp?.Rate),
                    CPPMaxAmountFormatted = FormatHelper.FormatValueOrNull(cpp?.MaxAmount, valueFormat),
                    EIRateFormatted = FormatHelper.FormatPercent(ei?.Rate),
                    EIMaxAmountFormatted = FormatHelper.FormatValueOrNull(ei?.MaxAmount, valueFormat),
                    CPPBasicExemptionAmountFormatted = FormatHelper.FormatValueOrNull(cppBasicExemptionAmount, valueFormat),
                    FederalBasicPersonalAmountFormatted = FormatHelper.FormatValueOrNull(federalBasicPersonalAmount, valueFormat),
                    ProvincialBasicPersonalAmountFormatted = FormatHelper.FormatValueOrNull(provincialBasicPersonalAmount, valueFormat),
                    CanadaEmploymentBaseAmountFormatted = FormatHelper.FormatValueOrNull(canadaEmploymentBaseAmount, valueFormat),
                };

                items.Add(item);
            }

            return items;
        }

        public async Task<TaxSettingEditModel> GetTaxSetting(int year)
        {
            var settings = await _taxSettingSearch.Select(x => x.AccountId == _identity.AccountId && x.PeriodYear == year);
            var rates = await _taxRateSearch.Select(x => x.AccountId == _identity.AccountId && x.PeriodYear == year);

            var cpp = rates.Find(x => x.PeriodYear == year && x.Name == Constants.Tax.CPP);
            var ei = rates.Find(x => x.PeriodYear == year && x.Name == Constants.Tax.EI);

            var item = new TaxSettingEditModel
            {
                CPPRate = cpp?.Rate,
                CPPMaxAmount = cpp?.MaxAmount,
                EIRate = ei?.Rate,
                EIMaxAmount = ei?.MaxAmount,
                CPPBasicExemptionAmount = settings.Find(x => x.Name == Constants.Tax.CPPBasicExemptionAmount)?.Value,
                FederalBasicPersonalAmount = settings.Find(x => x.Name == Constants.Tax.FederalBasicPersonalAmount)?.Value,
                ProvincialBasicPersonalAmount = settings.Find(x => x.Name == Constants.Tax.AlbertaBasicPersonalAmount)?.Value,
                CanadaEmploymentBaseAmount = settings.Find(x => x.Name == Constants.Tax.CanadaEmploymentBaseAmount)?.Value,

                FederalTaxRates = rates
                    .Where(x => x.Name == Constants.Tax.FederalTax)
                    .OrderByDescending(x => x.MaxAmount)
                    .Select(x => new TaxRateModel
                    {
                        Rate = x.Rate,
                        MaxAmount = x.MaxAmount
                    })
                    .ToList(),

                ProvincialTaxRates = rates
                    .Where(x => x.Name == Constants.Tax.AlbertaTax)
                    .OrderByDescending(x => x.MaxAmount)
                    .Select(x => new TaxRateModel
                    {
                        Rate = x.Rate,
                        MaxAmount = x.MaxAmount
                    })
                    .ToList()
            };

            return item;
        }

        public async Task Update(int year, TaxSettingEditModel model)
        {
            var settings = await _taxSettingSearch.Select(x => x.AccountId == _identity.AccountId && x.PeriodYear == year);
            var rates = await _taxRateSearch.Select(x => x.AccountId == _identity.AccountId && x.PeriodYear == year);

            await UpdateSettings(year, model, settings);
            await UpdateSpecialRate(year, Constants.Tax.CPP, model.CPPRate!.Value, model.CPPMaxAmount!.Value, rates);
            await UpdateSpecialRate(year, Constants.Tax.EI, model.EIRate!.Value, model.EIMaxAmount!.Value, rates);
            await UpdateRates(year, Constants.Tax.FederalTax, model.FederalTaxRates, rates);
            await UpdateRates(year, Constants.Tax.AlbertaTax, model.ProvincialTaxRates, rates);
        }

        private async Task UpdateSettings(int year, TaxSettingEditModel model, List<TaxSetting> existing)
        {
            var insert = new List<TaxSetting>();
            var update = new List<TaxSetting>();

            AddUpdatedSetting(existing, insert, update, year, Constants.Tax.CPPBasicExemptionAmount, model.CPPBasicExemptionAmount!.Value);
            AddUpdatedSetting(existing, insert, update, year, Constants.Tax.FederalBasicPersonalAmount, model.FederalBasicPersonalAmount!.Value);
            AddUpdatedSetting(existing, insert, update, year, Constants.Tax.AlbertaBasicPersonalAmount, model.ProvincialBasicPersonalAmount!.Value);
            AddUpdatedSetting(existing, insert, update, year, Constants.Tax.CanadaEmploymentBaseAmount, model.CanadaEmploymentBaseAmount!.Value);

            await _taxSettingStore.Update(insert, update);
        }

        private void AddUpdatedSetting(
            List<TaxSetting> existing,
            List<TaxSetting> insert,
            List<TaxSetting> update,
            int year,
            string name,
            decimal value
            )
        {
            var item = existing.Find(x => x.Name == name);
            if (item != null)
            {
                item.Value = value;
                update.Add(item);
                return;
            }

            item = new TaxSetting
            {
                AccountId = _identity.AccountId,
                Name = name,
                PeriodYear = year,
                Value = value
            };

            insert.Add(item);
        }

        private async Task UpdateRates(int year, string name, List<TaxRateModel> rates, List<TaxRate> allExisting)
        {
            var existing = allExisting.FindAll(x => string.Equals(x.Name, name, StringComparison.OrdinalIgnoreCase));
            var delete = GetDeletedRates(rates, existing);
            var update = GetUpdatedRates(rates, existing);
            var insert = GetInsertedRates(year, name, rates, existing);

            await _taxRateStore.Update(insert, update, delete);
        }

        private List<TaxRate> GetDeletedRates(List<TaxRateModel> rates, List<TaxRate> existing)
        {
            var delete = new List<TaxRate>();

            if (existing.Count <= rates.Count)
                return delete;

            for (int i = rates.Count; i < existing.Count; i++)
                delete.Add(existing[i]);

            return delete;
        }

        private List<TaxRate> GetUpdatedRates(List<TaxRateModel> rates, List<TaxRate> existing)
        {
            var update = new List<TaxRate>();

            for (int i = 0; i < rates.Count && i < existing.Count; i++)
            {
                var rateModel = rates[i];
                var rate = existing[i];

                if (rate.Rate == rateModel.Rate && rate.MaxAmount == rateModel.MaxAmount)
                    continue;

                rate.Rate = rateModel.Rate;
                rate.MaxAmount = rateModel.MaxAmount;

                update.Add(rate);
            }

            return update;
        }

        private List<TaxRate> GetInsertedRates(int year, string name, List<TaxRateModel> rates, List<TaxRate> existing)
        {
            var insert = new List<TaxRate>();

            for (int i = existing.Count; i < rates.Count; i++)
            {
                var rateModel = rates[i];

                var rate = new TaxRate
                {
                    AccountId = _identity.AccountId,
                    Name = name,
                    PeriodYear = year,
                    Rate = rateModel.Rate,
                    MaxAmount = rateModel.MaxAmount
                };

                insert.Add(rate);
            }

            return insert;
        }

        private async Task UpdateSpecialRate(int year, string name, decimal rate, decimal maxAmount, List<TaxRate> existing)
        {
            var rateEntity = existing.Find(x => string.Equals(x.Name, name));

            if (rateEntity != null)
            {
                if (rateEntity.Rate != rate || rateEntity.MaxAmount != maxAmount)
                {
                    rateEntity.Rate = rate;
                    rateEntity.MaxAmount = maxAmount;

                    await _taxRateStore.Update(rateEntity);
                }

                return;
            }

            rateEntity = new TaxRate
            {
                AccountId = _identity.AccountId,
                Name = name,
                PeriodYear = year,
                Rate = rate,
                MaxAmount = maxAmount
            };

            await _taxRateStore.Insert(rateEntity);
        }

        public async Task Delete(int year)
        {
            await _taxRateStore.Delete(year);
            await _taxSettingStore.Delete(year);
        }
    }
}
