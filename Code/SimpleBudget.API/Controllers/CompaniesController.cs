using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class CompaniesController : BaseApiController
    {
        private readonly IdentityService _identity;
        private readonly CompanySearch _companySearch;
        private readonly CompanyStore _companyStore;
        private readonly PaymentSearch _paymentSearch;

        public CompaniesController(
            IdentityService identity,
            CompanySearch companySearch,
            CompanyStore companyStore,
            PaymentSearch paymentSearch
            )
        {
            _identity = identity;
            _companySearch = companySearch;
            _companyStore = companyStore;
            _paymentSearch = paymentSearch;
        }

        [HttpGet]
        public async Task<ActionResult<List<CompanyGridModel>>> GetCompanies()
        {
            var categories = await _companySearch.Bind(
                x => new CompanyGridModel
                {
                    CompanyId = x.CompanyId,
                    Name = x.Name,
                    PaymentCount = x.Payments.Count
                },
                x => x.AccountId == _identity.AccountId
            );

            return categories.OrderBy(x => x.Name).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyEditModel>> GetCompany(int id)
        {
            var company = await _companySearch.SelectFirst(x => x.CompanyId == id && x.AccountId == _identity.AccountId);
            if (company == null)
                return BadRequest(new ProblemDetails { Title = "Company doesn't exist" });

            var paymentCount = await _paymentSearch.Count(x => x.CompanyId == id);

            return new CompanyEditModel
            {
                Name = company.Name,
                PaymentCount = paymentCount
            };
        }

        [HttpGet("exists")]
        public async Task<ActionResult<bool>> CompanyExists(string name, int? excludeId)
        {
            var item = await _companySearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.Name == name);
            return item != null && item.CompanyId != excludeId;
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateCompany(CategoryEditModel model)
        {
            if (await _companySearch.Exists(x => x.AccountId == _identity.AccountId && x.Name == model.Name))
                return BadRequest(new ProblemDetails { Title = "The company with such a name already exists" });

            var company = new Company
            {
                AccountId = _identity.AccountId,
                Name = model.Name
            };

            await _companyStore.Insert(company);

            return company.CompanyId;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCompany(int id, CompanyEditModel model)
        {
            var company = await _companySearch.SelectFirst(x => x.CompanyId == id && x.AccountId == _identity.AccountId);
            if (company == null)
                return BadRequest(new ProblemDetails { Title = "Company doesn't exist" });

            company.Name = model.Name;

            await _companyStore.Update(company);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCompany(int id)
        {
            var company = await _companySearch.SelectFirst(x => x.CompanyId == id && x.AccountId == _identity.AccountId);
            if (company == null)
                return BadRequest(new ProblemDetails { Title = "Company doesn't exist" });

            if (await _paymentSearch.Exists(x => x.CompanyId == id))
                return BadRequest(new ProblemDetails { Title = "Category has payments" });

            await _companyStore.Delete(company);

            return Ok();
        }
    }
}
