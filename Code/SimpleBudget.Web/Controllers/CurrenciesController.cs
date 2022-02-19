using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.Data;
using SimpleBudget.Web.Models.Companies;

namespace SimpleBudget.Web.Controllers
{
    [Authorize]
    public class CurrenciesController : BaseController
    {
        /*
        public IActionResult Index()
        {
            var currencies = Searches.Currency.Bind(
                x => new CurrencyIndexModel.Item
                {
                    CurrencyId = x.CurrencyId,
                    Code = x.Code,
                    ValueFormat = x.ValueFormat,
                    WalletCount = x.Wallets.Count,
                    LatestActualRate = x.CurrencyRates
                        .Where(y => y.BankOfCanada == false)
                        .OrderByDescending(y => y.StartDate)
                        .Select(y => new CurrencyIndexModel.RateItem
                        {
                            StartDate = y.StartDate,
                            Rate = y.Rate
                        })
                        .FirstOrDefault(),
                    LatestOfficialRate = x.CurrencyRates
                        .Where(y => y.BankOfCanada == true)
                        .OrderByDescending(y => y.StartDate)
                        .Select(y => new CurrencyIndexModel.RateItem
                        {
                            StartDate = y.StartDate,
                            Rate = y.Rate
                        })
                        .FirstOrDefault()

                },
                x => x.AccountId == CurrentSession.AccountId,
                "Code"
            );

            var model = new CurrencyIndexModel { Items = currencies };

            return View(model);
        }

        public IActionResult Add()
        {
            return View("Edit", new CurrencyEditModel());
        }

        [HttpPost]
        public IActionResult Add(CurrencyEditModel model)
        {
            if (Searches.Company.Exists(x => x.Name == model.Name && x.AccountId == CurrentSession.AccountId))
            {
                model.Error = "The company with such a name already exists";
                return View("Edit", model);
            }

            var company = new Company
            {
                Name = model.Name,
                AccountId = CurrentSession.AccountId
            };

            Stores.Company.Insert(company);

            return RedirectToAction("Index");
        }

        public IActionResult Edit(int id)
        {
            var company = Searches.Company.SelectFirst(x => x.CompanyId == id && x.AccountId == CurrentSession.AccountId);

            if (company == null)
                return RedirectToAction("Index");

            var model = new CompanyEditModel
            {
                Id = id,
                Name = company.Name,
                PaymentCount = Searches.Payment.Count(x => x.CompanyId == id)
            };

            return View(model);
        }

        [HttpPost]
        public IActionResult Edit(CompanyEditModel model)
        {
            if (Searches.Company.Exists(x => x.Name == model.Name && x.CompanyId != model.Id && x.AccountId == CurrentSession.AccountId))
            {
                model.Error = "The company with such a name already exists";
                return View(model);
            }

            var company = Searches.Company.SelectFirst(x => x.CompanyId == model.Id && x.AccountId == CurrentSession.AccountId);

            company.Name = model.Name;

            Stores.Company.Update(company);

            return RedirectToAction("Index");
        }

        public IActionResult Remove(int id)
        {
            var model = Searches.Company.BindFirst(
                x => new CompanyRemoveModel
                {
                    Id = id,
                    Name = x.Name,
                    PaymentCount = x.Payments.Count
                },
                x => x.CompanyId == id && x.AccountId == CurrentSession.AccountId
            );

            if (model == null)
                return RedirectToAction("Index");

            return View(model);
        }

        [HttpPost]
        public IActionResult Remove(CompanyRemoveModel model)
        {
            var company = Searches.Company.SelectFirst(x => x.CompanyId == model.Id && x.AccountId == CurrentSession.AccountId);

            if (!Searches.Payment.Exists(x => x.CompanyId == model.Id))
                Stores.Company.Delete(company);

            return RedirectToAction("Index");
        }
        */
    }
}
