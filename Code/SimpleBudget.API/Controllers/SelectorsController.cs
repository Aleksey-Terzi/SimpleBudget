using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class SelectorsController : BaseApiController
    {
        private readonly IdentityService _identity;
        private readonly CompanySearch _companySearch;
        private readonly CategorySearch _categorySearch;
        private readonly WalletSearch _walletSearch;
        private readonly PersonSearch _personSearch;

        public SelectorsController(
            IdentityService identity,
            CompanySearch companySearch,
            CategorySearch categorySearch,
            WalletSearch walletSearch,
            PersonSearch personSearch
            )
        {
            _identity = identity;
            _companySearch = companySearch;
            _categorySearch = categorySearch;
            _walletSearch = walletSearch;
            _personSearch = personSearch;
        }

        [HttpGet]
        public async Task<ActionResult<SelectorsModel>> GetSelectors()
        {
            var model = new SelectorsModel();

            model.Companies = (await _companySearch.Bind(x => x.Name, x => x.AccountId == _identity.AccountId))
                .Distinct()
                .OrderBy(x => x)
                .ToList();

            model.Categories = (await _categorySearch.Bind(x => x.Name, x => x.AccountId == _identity.AccountId))
                .Distinct()
                .OrderBy(x => x)
                .ToList();

            model.Wallets = (await _walletSearch.Bind(x => x.Name, x => x.AccountId == _identity.AccountId))
                .OrderBy(x => x)
                .ToList();

            model.Persons = (await _personSearch.Bind(x => x.Name, x => x.AccountId == _identity.AccountId))
                .OrderBy(x => x)
                .ToList();

            return model;
        }
    }
}
