using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class ImportController : BaseApiController
    {
        private readonly ImportPaymentSearchService _searchService;
        private readonly ImportPaymentUpdateService _updateService;

        public ImportController(
            ImportPaymentSearchService searchService,
            ImportPaymentUpdateService updateService
            )
        {
            _searchService = searchService;
            _updateService = updateService;
        }

        [HttpPost("upload")]
        public async Task<ActionResult<ImportModel>> UploadFile([FromForm] UploadFileModel model)
        {
            using var file = model.File.OpenReadStream();

            var output = await _searchService.GetSuggestedPayments(file);

            return output;
        }

        [HttpPost("save")]
        public async Task<ActionResult<List<int>>> SavePayments(NewImportModel model)
        {
            return await _updateService.SavePayments(model);
        }
    }
}
