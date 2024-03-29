﻿using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class CurrencyRateService
    {
        private readonly IdentityService _identity;
        private readonly CurrencySearch _currencySearch;
        private readonly CurrencyRateSearch _currencyRateSearch;
        private readonly CurrencyRateStore _currencyRateStore;

        public CurrencyRateService(
            IdentityService identity,
            CurrencySearch currencySearch,
            CurrencyRateSearch currencyRateSearch,
            CurrencyRateStore currencyRateStore
            )
        {
            _identity = identity;
            _currencySearch = currencySearch;
            _currencyRateSearch = currencyRateSearch;
            _currencyRateStore = currencyRateStore;
        }

        public async Task<int> GetActualPage(int currencyId, int rateId)
        {
            return await FilterHelper.GetPageAsync(
                rateId,
                null,
                0,
                async (currencyRateId) => await _currencyRateSearch.GetRowNumber(currencyId, currencyRateId)
            );
        }

        public async Task<(CurrencyRateGridModel[] Items, PaginationData Pagination)> GetRatesAsync(int currencyId, int? rateId, int? page)
        {
            var count = await _currencyRateSearch.Count(x => x.CurrencyId == currencyId && x.Currency.AccountId == _identity.AccountId);

            var actualPage = await FilterHelper.GetPageAsync(
                rateId,
                page,
                count,
                async (currencyRateId) => await _currencyRateSearch.GetRowNumber(currencyId, currencyRateId)
            );

            var skip = (actualPage - 1) * FilterHelper.PageSize;

            var rates = await _currencyRateSearch.Bind(
                x => x,
                x => x.CurrencyId == currencyId && x.Currency.AccountId == _identity.AccountId,
                q => q
                    .OrderByDescending(x => x.StartDate)
                    .ThenBy(x => x.CurrencyRateId)
                    .Skip(skip)
                    .Take(FilterHelper.PageSize)
            );

            var result = rates.Select(x => new CurrencyRateGridModel
            {
                CurrencyRateId = x.CurrencyRateId,
                StartDate = DateHelper.ToClient(x.StartDate)!,
                Rate = x.Rate,
                BankOfCanada = x.BankOfCanada
            })
            .ToArray();

            var pagination = FilterHelper.GetPagination(actualPage, count);

            return (result, pagination);
        }

        public async Task<int?> CreateRateAsync(int currencyId, CurrencyRateEditModel model)
        {
            if (!await _currencySearch.Exists(x => x.AccountId == _identity.AccountId && x.CurrencyId == currencyId))
                return null;

            var rate = new CurrencyRate
            {
                CurrencyId = currencyId,
                StartDate = DateHelper.ToServer(model.StartDate)!.Value,
                Rate = model.Rate,
                BankOfCanada = model.BankOfCanada
            };

            await _currencyRateStore.Insert(rate);

            return rate.CurrencyRateId;
        }

        public async Task<bool> UpdateRateAsync(int rateId, CurrencyRateEditModel model)
        {
            var rate = await _currencyRateSearch.SelectFirst(x => x.CurrencyRateId == rateId && x.Currency.AccountId == _identity.AccountId);
            if (rate == null)
                return false;

            rate.StartDate = DateHelper.ToServer(model.StartDate)!.Value;
            rate.Rate = model.Rate;
            rate.BankOfCanada = model.BankOfCanada;

            await _currencyRateStore.Update(rate);

            return true;
        }

        public async Task<bool> DeleteRateAsync(int rateId)
        {
            var rate = await _currencyRateSearch.SelectFirst(x => x.CurrencyRateId == rateId && x.Currency.AccountId == _identity.AccountId);
            if (rate == null)
                return false;

            await _currencyRateStore.Delete(rate);

            return true;
        }
    }
}
