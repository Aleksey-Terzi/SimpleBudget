using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class CurrencyService
    {
        public enum UpdateCurrencyResult { NoCurrency, CodeExists, Created }
        public enum DeleteCurrencyResult { NoCurrency, HasWallets, Deleted }

        private readonly CurrencySearch _currencySearch;
        private readonly CurrencyStore _currencyStore;
        private readonly WalletSearch _walletSearch;

        public CurrencyService(
            CurrencySearch currencySearch,
            CurrencyStore currencyStore,
            WalletSearch walletSearch
            )
        {
            _currencySearch = currencySearch;
            _currencyStore = currencyStore;
            _walletSearch = walletSearch;
        }

        public async Task<CurrencyGridModel[]> GetCurrenciesAsync(int accountId)
        {
            var items = await _currencySearch.Bind(
                x => new
                {
                    x.CurrencyId,
                    x.Code,
                    x.ValueFormat,
                    MarketRate = x.CurrencyRates
                                    .Where(x => !x.BankOfCanada)
                                    .OrderByDescending(x => x.StartDate)
                                    .FirstOrDefault(),
                    BankRate = x.CurrencyRates
                                    .Where(x => x.BankOfCanada)
                                    .OrderByDescending(x => x.StartDate)
                                    .FirstOrDefault(),
                },
                x => x.AccountId == accountId,
                q => q.OrderBy(x => x.Code)
            );

            return items
                .Select(x => new CurrencyGridModel
                {
                    CurrencyId = x.CurrencyId,
                    Code = x.Code,
                    ValueFormat = x.ValueFormat,
                    MarketStartDate = DateHelper.Format(x.MarketRate?.StartDate),
                    MarketRate = x.MarketRate?.Rate,
                    BankStartDate = DateHelper.Format(x.BankRate?.StartDate),
                    BankRate = x.BankRate?.Rate,
                })
                .ToArray();
        }

        public async Task<CurrencyEditModel?> GetCurrencyAsync(int accountId, int currencyId)
        {
            var currency = await _currencySearch.SelectFirst(x => x.AccountId == accountId && x.CurrencyId == currencyId);
            if (currency == null)
                return null;

            var walletCount = await _walletSearch.Count(x => x.CurrencyId == currencyId);

            return new CurrencyEditModel
            {
                Code = currency.Code,
                ValueFormat = currency.ValueFormat,
                WalletCount = walletCount
            };
        }

        public async Task<bool> CurrencyExistsAsync(int accountId, string currencyCode, int? excludeId)
        {
            var currency = await _currencySearch.SelectFirst(x => x.AccountId == accountId && x.Code == currencyCode);
            return currency != null && currency.CurrencyId != excludeId;
        }

        public async Task<int?> CreateCurrencyAsync(int accountId, CurrencyEditModel model)
        {
            if (await _currencySearch.Exists(x => x.AccountId == accountId && x.Code == model.Code))
                return null;

            var currency = new Currency
            {
                AccountId = accountId,
                Code = model.Code,
                ValueFormat = model.ValueFormat
            };

            await _currencyStore.Insert(currency);

            return currency.CurrencyId;
        }

        public async Task<UpdateCurrencyResult> UpdateCurrencyAsync(int accountId, int currencyId, CurrencyEditModel model)
        {
            var currency = await _currencySearch.SelectFirst(x => x.AccountId == accountId && x.CurrencyId == currencyId);
            if (currency == null)
                return UpdateCurrencyResult.NoCurrency;

            if (await _currencySearch.Exists(x => x.AccountId == accountId && x.Code == model.Code && x.CurrencyId != currencyId))
                return UpdateCurrencyResult.CodeExists;

            currency.Code = model.Code;

            await _currencyStore.Update(currency);

            return UpdateCurrencyResult.Created;
        }

        public async Task<DeleteCurrencyResult> DeleteCurrencyAsync(int accountId, int currencyId)
        {
            var currency = await _currencySearch.SelectFirst(x => x.AccountId == accountId && x.CurrencyId == currencyId);
            if (currency == null)
                return DeleteCurrencyResult.NoCurrency;

            if (await _walletSearch.Exists(x => x.CurrencyId == currencyId))
                return DeleteCurrencyResult.HasWallets;

            await _currencyStore.DeleteWithRates(currencyId);

            return DeleteCurrencyResult.Deleted;
        }
    }
}
