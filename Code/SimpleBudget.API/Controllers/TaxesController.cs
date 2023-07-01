using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class TaxesController : BaseApiController
    {
        private readonly TaxService _taxService;

        public TaxesController(TaxService taxService)
        {
            _taxService = taxService;
        }

        [HttpGet]
        public async Task<ActionResult<TaxModel>> GetTaxes(int? personId, int? year)
        {
            return await _taxService.CreateModelAsync(personId, year, null, null);
        }

        [HttpPost("close")]
        public async Task<ActionResult<TaxModel>> CloseYear(int? personId, int? year)
        {
            return await _taxService.CloseYearAsync(personId, year);
        }

        [HttpPost("open")]
        public async Task<ActionResult<TaxModel>> OpenYear(int? personId, int? year)
        {
            return await _taxService.OpenYearAsync(personId, year);
        }
    }
}
