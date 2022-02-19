using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.Data;
using SimpleBudget.Web.Models.Wallets;

namespace SimpleBudget.Web.Controllers
{
    [Authorize]
    public class WalletsController : BaseController
    {
        public IActionResult Index()
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var wallets = Searches.Wallet.Bind(
                x => new IndexModel.Item
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

            var model = new IndexModel { Items = wallets };

            return View(model);
        }

        public IActionResult Add()
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var model = new EditModel();
            LoadPersonsAndCurrencies(model);
            return View("Edit", model);
        }

        [HttpPost]
        public IActionResult Add(EditModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            if (Searches.Wallet.Exists(x => x.Name == model.Name && x.AccountId == AccountId))
            {
                model.Error = "The wallet with such a name already exists";
                LoadPersonsAndCurrencies(model);
                return View("Edit", model);
            }

            var wallet = new Wallet
            {
                Name = model.Name,
                AccountId = AccountId,
                PersonId = model.PersonId,
                CurrencyId = model.CurrencyId
            };

            Stores.Wallet.Insert(wallet);

            return RedirectToAction("Index");
        }

        public IActionResult Edit(int id)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var wallet = Searches.Wallet.SelectFirst(x => x.WalletId == id && x.AccountId == AccountId);

            if (wallet == null)
                return RedirectToAction("Index");

            var model = new EditModel
            {
                Id = id,
                PersonId = wallet.PersonId,
                CurrencyId = wallet.CurrencyId,
                Name = wallet.Name,
                PaymentCount = Searches.Payment.Count(x => x.WalletId == id)
            };

            LoadPersonsAndCurrencies(model);

            return View(model);
        }

        [HttpPost]
        public IActionResult Edit(EditModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            if (Searches.Wallet.Exists(x => x.Name == model.Name && x.WalletId != model.Id && x.AccountId == AccountId))
            {
                model.Error = "The wallet with such a name already exists";
                LoadPersonsAndCurrencies(model);
                return View(model);
            }

            var wallet = Searches.Wallet.SelectFirst(x => x.WalletId == model.Id && x.AccountId == AccountId);

            if (wallet != null)
            {
                wallet.Name = model.Name;
                wallet.PersonId = model.PersonId;
                wallet.CurrencyId = model.CurrencyId;

                Stores.Wallet.Update(wallet);
            }

            return RedirectToAction("Index");
        }

        private void LoadPersonsAndCurrencies(EditModel model)
        {
            model.Persons = Searches.Person.Bind(
                x => new EditModel.PersonItem
                {
                    PersonId = x.PersonId,
                    Name = x.Name
                },
                x => x.AccountId == AccountId,
                q => q.OrderBy(x => x.PersonId)
            ).ToList();

            model.Currencies = Searches.Currency.Bind(
                x => new EditModel.CurrencyItem
                {
                    CurrencyId = x.CurrencyId,
                    Code = x.Code
                },
                x => x.AccountId == AccountId,
                q => q.OrderBy(x => x.Code)
            ).ToList();
        }

        public IActionResult Remove(int id)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var model = Searches.Wallet.BindFirst(
                x => new RemoveModel
                {
                    Id = id,
                    Name = x.Name,
                    PersonName = x.Person.Name,
                    CurrencyCode = x.Currency.Code,
                    PaymentCount = x.Payments.Count
                },
                x => x.WalletId == id && x.AccountId == AccountId
            );

            if (model == null)
                return RedirectToAction("Index");

            return View(model);
        }

        [HttpPost]
        public IActionResult Remove(RemoveModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var wallet = Searches.Wallet.SelectFirst(x => x.WalletId == model.Id && x.AccountId == AccountId);

            if (wallet != null && !Searches.Payment.Exists(x => x.WalletId == model.Id))
                Stores.Wallet.Delete(wallet);

            return RedirectToAction("Index");
        }
    }
}