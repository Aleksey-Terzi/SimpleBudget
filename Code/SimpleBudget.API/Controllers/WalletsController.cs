using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class WalletsController : BaseApiController
    {
        private readonly WalletSearch _walletSearch;
        private readonly WalletStore _walletStore;
        private readonly PaymentSearch _paymentSearch;
        private readonly PersonSearch _personSearch;
        private readonly CurrencySearch _currencySearch;

        public WalletsController(
            WalletSearch walletSearch,
            WalletStore walletStore,
            PaymentSearch paymentSearch,
            PersonSearch personSearch,
            CurrencySearch currencySearch
            )
        {
            _walletSearch = walletSearch;
            _walletStore = walletStore;
            _paymentSearch = paymentSearch;
            _personSearch = personSearch;
            _currencySearch = currencySearch;
        }

        [HttpGet]
        public async Task<ActionResult<List<WalletGridModel>>> GetWallets()
        {
            var wallets = await _walletSearch.Bind(
                x => new WalletGridModel
                {
                    WalletId = x.WalletId,
                    WalletName = x.Name,
                    PersonName = x.Person.Name,
                    CurrencyCode = x.Currency.Code,
                    PaymentCount = x.Payments.Count
                },
                x => x.AccountId == AccountId,
                q => q.OrderBy(x => x.WalletName)
            );

            return wallets;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WalletEditModel>> GetWallet(int id, bool includeNames)
        {
            var wallet = includeNames
                ? await _walletSearch.SelectFirst(x => x.WalletId == id && x.AccountId == AccountId, x => x.Person, x => x.Currency)
                : await _walletSearch.SelectFirst(x => x.WalletId == id && x.AccountId == AccountId);

            if (wallet == null)
                return BadRequest(new ProblemDetails { Title = "Wallet doesn't exist" });

            var paymentCount = await _paymentSearch.Count(x => x.WalletId == id);

            var model = new WalletEditModel
            {
                PersonId = wallet.PersonId,
                CurrencyId = wallet.CurrencyId,
                WalletName = wallet.Name,
                PaymentCount = paymentCount,
                PersonName = wallet.Person?.Name,
                CurrencyCode = wallet.Currency?.Code
            };

            return model;
        }

        [HttpGet("selectors")]
        public async Task<ActionResult<WalletSelectorsModel>> GetSelectors()
        {
            var model = new WalletSelectorsModel();

            model.Persons = await _personSearch.Bind(
                x => new ItemModel
                {
                    Id = x.PersonId,
                    Name = x.Name
                },
                x => x.AccountId == AccountId,
                q => q.OrderBy(x => x.Id)
            );

            model.Currencies = await _currencySearch.Bind(
                x => new ItemModel
                {
                    Id = x.CurrencyId,
                    Name = x.Code
                },
                x => x.AccountId == AccountId,
                q => q.OrderBy(x => x.Name)
            );

            return model;
        }

        [HttpGet("exists")]
        public async Task<ActionResult<bool>> WalletExists(string name, int? excludeId)
        {
            var item = await _walletSearch.SelectFirst(x => x.AccountId == AccountId && x.Name == name);
            return item != null && item.WalletId != excludeId;
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateWallet(WalletEditModel model)
        {
            if (await _walletSearch.Exists(x => x.AccountId == AccountId && x.Name == model.WalletName))
                return BadRequest(new ProblemDetails { Title = "The wallet with such a name already exists" });

            var wallet = new Wallet
            {
                AccountId = AccountId,
                Name = model.WalletName,
                PersonId = model.PersonId,
                CurrencyId = model.CurrencyId
            };

            await _walletStore.Insert(wallet);

            return wallet.WalletId;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateWallet(int id, WalletEditModel model)
        {
            var wallet = await _walletSearch.SelectFirst(x => x.WalletId == id && x.AccountId == AccountId);
            if (wallet == null)
                return BadRequest(new ProblemDetails { Title = "Wallet doesn't exist" });

            wallet.Name = model.WalletName;
            wallet.PersonId = model.PersonId;
            wallet.CurrencyId = model.CurrencyId;

            await _walletStore.Update(wallet);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteWallet(int id)
        {
            var wallet = await _walletSearch.SelectFirst(x => x.WalletId == id && x.AccountId == AccountId);
            if (wallet == null)
                return BadRequest(new ProblemDetails { Title = "Wallet doesn't exist" });

            if (await _paymentSearch.Exists(x => x.WalletId == id))
                return BadRequest(new ProblemDetails { Title = "Category has payments" });

            await _walletStore.Delete(wallet);

            return Ok();
        }
    }
}
