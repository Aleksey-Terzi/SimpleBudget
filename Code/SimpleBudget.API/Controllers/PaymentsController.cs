using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class PaymentsController : BaseApiController
    {
        private readonly PaymentSearchService _searchService;
        private readonly PaymentUpdateService _updateService;

        public PaymentsController(
            PaymentSearchService searchService,
            PaymentUpdateService updateService
            )
        {
            _searchService = searchService;
            _updateService = updateService;
        }

        [HttpGet]
        public async Task<ActionResult<PaymentGridItemModel[]>> SearchPayments([FromQuery] PaymentFilterModel input)
        {
            var (items, pagination) = await _searchService.Search(input);

            Response.AddPaginationHeader(pagination);

            return items;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentEditItemModel>> GetPayment(int id)
        {
            var payment = await _searchService.GetPayment(id);

            if (payment == null)
                return BadRequest(new ProblemDetails { Title = "Payment Not Found" });

            return payment;
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreatePayment(PaymentEditItemModel model)
        {
            return await _updateService.CreatePayment(model);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePayment([FromRoute] int id, PaymentEditItemModel model)
        {
            await _updateService.UpdatePayment(id, model);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePayment([FromRoute] int id)
        {
            await _updateService.DeletePayment(id);

            return Ok();
        }
    }
}
