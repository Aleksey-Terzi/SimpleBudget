using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class CurrencyService
    {
        public enum UpdateCurrencyResult { NoCurrency, CodeExists, Created }
        public enum DeleteCurrencyResult { NoCurrency, HasWallets, Deleted }

        private readonly IdentityService _identity;
        private readonly CurrencySearch _currencySearch;
        private readonly CurrencyStore _currencyStore;
        private readonly WalletSearch _walletSearch;

        public CurrencyService(
            IdentityService identity,
            CurrencySearch currencySearch,
            CurrencyStore currencyStore,
            WalletSearch walletSearch
            )
        {
            _identity = identity;
            _currencySearch = currencySearch;
            _currencyStore = currencyStore;
            _walletSearch = walletSearch;
        }

        public async Task<CurrencyGridModel[]> GetCurrenciesAsync()
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
                x => x.AccountId == _identity.AccountId,
                q => q.OrderBy(x => x.Code)
            );

            return items
                .Select(x => new CurrencyGridModel
                {
                    CurrencyId = x.CurrencyId,
                    Code = x.Code,
                    ValueFormat = x.ValueFormat,
                    MarketStartDate = DateHelper.ToClient(x.MarketRate?.StartDate),
                    MarketRate = x.MarketRate?.Rate,
                    BankStartDate = DateHelper.ToClient(x.BankRate?.StartDate),
                    BankRate = x.BankRate?.Rate,
                })
                .ToArray();
        }

        public async Task<CurrencyEditModel?> GetCurrencyAsync(int currencyId)
        {
            var currency = await _currencySearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.CurrencyId == currencyId);
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

        public async Task<bool> CurrencyExistsAsync(string currencyCode, int? excludeId)
        {
            var currency = await _currencySearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.Code == currencyCode);
            return currency != null && currency.CurrencyId != excludeId;
        }

        public async Task<int?> CreateCurrencyAsync(CurrencyEditModel model)
        {
            if (await _currencySearch.Exists(x => x.AccountId == _identity.AccountId && x.Code == model.Code))
                return null;

            var currency = new Currency
            {
                AccountId = _identity.AccountId,
                Code = model.Code,
                ValueFormat = model.ValueFormat
            };

            await _currencyStore.Insert(currency);

            return currency.CurrencyId;
        }

        public async Task<UpdateCurrencyResult> UpdateCurrencyAsync(int currencyId, CurrencyEditModel model)
        {
            var currency = await _currencySearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.CurrencyId == currencyId);
            if (currency == null)
                return UpdateCurrencyResult.NoCurrency;

            if (await _currencySearch.Exists(x => x.AccountId == _identity.AccountId && x.Code == model.Code && x.CurrencyId != currencyId))
                return UpdateCurrencyResult.CodeExists;

            currency.Code = model.Code;

            await _currencyStore.Update(currency);

            return UpdateCurrencyResult.Created;
        }

        public async Task<DeleteCurrencyResult> DeleteCurrencyAsync(int currencyId)
        {
            var currency = await _currencySearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.CurrencyId == currencyId);
            if (currency == null)
                return DeleteCurrencyResult.NoCurrency;

            if (await _walletSearch.Exists(x => x.CurrencyId == currencyId))
                return DeleteCurrencyResult.HasWallets;

            await _currencyStore.DeleteWithRates(currencyId);

            return DeleteCurrencyResult.Deleted;
        }
    }
}
