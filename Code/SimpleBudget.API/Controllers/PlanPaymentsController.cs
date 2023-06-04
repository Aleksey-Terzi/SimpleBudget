using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class PlanPaymentsController : BaseApiController
    {
        private readonly PlanPaymentSearchService _searchService;
        private readonly PlanPaymentUpdateService _updateService;

        public PlanPaymentsController(
            PlanPaymentSearchService searchService,
            PlanPaymentUpdateService updateService
            )
        {
            _searchService = searchService;
            _updateService = updateService;
        }

        [HttpGet]
        public async Task<ActionResult<PlanPaymentGridItemModel[]>> SearchPlanPayments([FromQuery] PlanPaymentFilterModel input)
        {
            var (items, pagination) = await _searchService.Search(AccountId, input);

            Response.AddPaginationHeader(pagination);

            return items;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PlanPaymentEditItemModel>> GetPlanPayment(int id)
        {
            var planPayment = await _searchService.GetPlanPayment(AccountId, id);

            if (planPayment == null)
                return BadRequest(new ProblemDetails { Title = "PlanPayment Not Found" });

            return planPayment;
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreatePayment(PlanPaymentEditItemModel model)
        {
            return await _updateService.CreatePlanPayment(AccountId, UserId, model);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePlanPayment([FromRoute] int id, PlanPaymentEditItemModel model)
        {
            await _updateService.UpdatePlanPayment(AccountId, UserId, id, model);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePlanPayment([FromRoute] int id)
        {
            await _updateService.DeletePlanPayment(AccountId, id);

            return Ok();
        }
    }
}