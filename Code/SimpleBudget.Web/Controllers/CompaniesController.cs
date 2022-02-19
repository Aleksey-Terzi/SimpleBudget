using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.Data;
using SimpleBudget.Web.Models.Companies;

namespace SimpleBudget.Web.Controllers
{
    [Authorize]
    public class CompaniesController : BaseController
    {
        public IActionResult Index()
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var companies = Searches.Company.Bind(
                x => new IndexModel.Item
                {
                    CompanyId = x.CompanyId,
                    Name = x.Name,
                    PaymentCount = x.Payments.Count
                },
                x => x.AccountId == AccountId,
                q => q.OrderBy(x => x.Name)
            );

            var model = new IndexModel { Items = companies };

            return View(model);
        }

        public IActionResult Add()
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            return View("Edit", new EditModel());
        }

        [HttpPost]
        public IActionResult Add(EditModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            if (Searches.Company.Exists(x => x.Name == model.Name && x.AccountId == AccountId))
            {
                model.Error = "The company with such a name already exists";
                return View("Edit", model);
            }

            var company = new Company
            {
                Name = model.Name,
                AccountId = AccountId
            };

            Stores.Company.Insert(company);

            return RedirectToAction("Index");
        }

        public IActionResult Edit(int id)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var company = Searches.Company.SelectFirst(x => x.CompanyId == id && x.AccountId == AccountId);

            if (company == null)
                return RedirectToAction("Index");

            var model = new EditModel
            {
                Id = id,
                Name = company.Name,
                PaymentCount = Searches.Payment.Count(x => x.CompanyId == id)
            };

            return View(model);
        }

        [HttpPost]
        public IActionResult Edit(EditModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            if (Searches.Company.Exists(x => x.Name == model.Name && x.CompanyId != model.Id && x.AccountId == AccountId))
            {
                model.Error = "The company with such a name already exists";
                return View(model);
            }

            var company = Searches.Company.SelectFirst(x => x.CompanyId == model.Id && x.AccountId == AccountId);

            if (company != null)
            {
                company.Name = model.Name;

                Stores.Company.Update(company);
            }

            return RedirectToAction("Index");
        }

        public IActionResult Remove(int id)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var model = Searches.Company.BindFirst(
                x => new RemoveModel
                {
                    Id = id,
                    Name = x.Name,
                    PaymentCount = x.Payments.Count
                },
                x => x.CompanyId == id && x.AccountId == AccountId
            );

            if (model == null)
                return RedirectToAction("Index");

            return View(model);
        }

        [HttpPost]
        public IActionResult Remove(RemoveModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var company = Searches.Company.SelectFirst(x => x.CompanyId == model.Id && x.AccountId == AccountId);

            if (company != null && !Searches.Payment.Exists(x => x.CompanyId == model.Id))
                Stores.Company.Delete(company);

            return RedirectToAction("Index");
        }
    }
}
