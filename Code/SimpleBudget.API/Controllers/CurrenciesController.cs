using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class CurrenciesController : BaseApiController
    {
        private readonly CurrencyService _currencyService;
        private readonly CurrencyRateService _currencyRateService;

        public CurrenciesController(
            CurrencyService currencyService,
            CurrencyRateService currencyRateService
            )
        {
            _currencyService = currencyService;
            _currencyRateService = currencyRateService;
        }

        [HttpGet]
        public async Task<ActionResult<CurrencyGridModel[]>> GetCurrencies()
        {
            return await _currencyService.GetCurrenciesAsync(AccountId);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CurrencyEditModel>> GetCurrency(int id)
        {
            var model = await _currencyService.GetCurrencyAsync(AccountId, id);
            if (model == null)
                return BadRequest(new ProblemDetails { Title = "Currency doesn't exist" });

            return model;
        }

        [HttpGet("exists")]
        public async Task<ActionResult<bool>> CurrencyExists(string code, int? excludeId)
        {
            return await _currencyService.CurrencyExistsAsync(AccountId, code, excludeId);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateCurrency(CurrencyEditModel model)
        {
            var currencyId = await _currencyService.CreateCurrencyAsync(AccountId, model);
            if (currencyId == null)
                return BadRequest(new ProblemDetails { Title = "The currency with such a code already exists" });

            return currencyId;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCurrency(int id, CurrencyEditModel model)
        {
            var result = await _currencyService.UpdateCurrencyAsync(AccountId, id, model);

            switch (result)
            {
                case CurrencyService.UpdateCurrencyResult.NoCurrency:
                    return BadRequest(new ProblemDetails { Title = "Currency doesn't exist" });
                case CurrencyService.UpdateCurrencyResult.CodeExists:
                    return BadRequest(new ProblemDetails { Title = "The currency with such a code already exists" });
                default:
                    return Ok();
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCurrency(int id)
        {
            var result = await _currencyService.DeleteCurrencyAsync(AccountId, id);

            switch (result)
            {
                case CurrencyService.DeleteCurrencyResult.NoCurrency:
                    return BadRequest(new ProblemDetails { Title = "Currency doesn't exist" });
                case CurrencyService.DeleteCurrencyResult.HasWallets:
                    return BadRequest(new ProblemDetails { Title = "Currency has wallets" });
                default:
                    return Ok();
            }
        }

        [HttpGet("{currencyId}/rates")]
        public async Task<ActionResult<CurrencyRateGridModel[]>> GetRates(int currencyId, int? rateId, int? page)
        {
            var (rates, pagination) = await _currencyRateService.GetRatesAsync(AccountId, currencyId, rateId, page);

            pagination.Id = rateId;

            Response.AddPaginationHeader(pagination);

            return rates;
        }

        [HttpPost("{currencyId}/rates")]
        public async Task<ActionResult<CurrencyRateGridModel[]>> CreateCurrencyRate(int currencyId, CurrencyRateEditModel model)
        {
            var rateId = await _currencyRateService.CreateRateAsync(AccountId, currencyId, model);
            if (rateId == null)
                return BadRequest(new ProblemDetails { Title = "Currency doesn't exist" });

            return await GetRates(currencyId, rateId, null);
        }

        [HttpPut("{currencyId}/rates/{rateId}")]
        public async Task<ActionResult<CurrencyRateGridModel[]>> UpdateCurrencyRate(int currencyId, int rateId, CurrencyRateEditModel model)
        {
            if (!await _currencyRateService.UpdateRateAsync(AccountId, rateId, model))
                return BadRequest(new ProblemDetails { Title = "Currency rate doesn't exist" });

            return await GetRates(currencyId, rateId, null);
        }

        [HttpDelete("{currencyId}/rates/{rateId}")]
        public async Task<ActionResult<CurrencyRateGridModel[]>> DeleteCurrencyRate(int currencyId, int rateId)
        {
            var actualPage = await _currencyRateService.GetActualPage(currencyId, rateId);

            if (!await _currencyRateService.DeleteRateAsync(AccountId, rateId))
                return BadRequest(new ProblemDetails { Title = "Currency rate doesn't exist" });

            return await GetRates(currencyId, null, actualPage);
        }
    }
}
