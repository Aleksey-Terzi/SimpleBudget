using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class TaxSettingsController : BaseApiController
    {
        private readonly TaxSettingService _service;

        public TaxSettingsController(TaxSettingService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<TaxSettingModel>> GetTaxSettings()
        {
            return await _service.GetTaxSettings();
        }

        [HttpGet("{year}")]
        public async Task<ActionResult<TaxSettingEditModel>> GetTaxSetting(int year)
        {
            return await _service.GetTaxSetting(year);
        }

        [HttpPut("{year}")]
        public async Task<ActionResult> Update(int year, TaxSettingEditModel model)
        {
            await _service.Update(year, model);
            return Ok();
        }

        [HttpDelete("{year}")]
        public async Task<ActionResult> Delete(int year)
        {
            await _service.Delete(year);
            return Ok();
        }
    }
}
