using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.Data;
using SimpleBudget.Web.Models.Categories;

namespace SimpleBudget.Web.Controllers
{
    [Authorize]
    public class CategoriesController : BaseController
    {
        public IActionResult Index()
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var categories = Searches.Category.Bind(
                x => new IndexModel.Item
                {
                    CategoryId = x.CategoryId,
                    Name = x.Name,
                    PaymentCount = x.Payments.Count
                },
                x => x.AccountId == AccountId,
                q => q.OrderBy(x => x.Name)
            );

            var model = new IndexModel { Items = categories };

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

            if (Searches.Category.Exists(x => x.Name == model.Name && x.AccountId == AccountId))
            {
                model.Error = "The category with such a name already exists";
                return View("Edit", model);
            }

            var category = new Category
            {
                Name = model.Name,
                AccountId = AccountId
            };

            Stores.Category.Insert(category);

            return RedirectToAction("Index");
        }

        public IActionResult Edit(int id)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var category = Searches.Category.SelectFirst(x => x.CategoryId == id && x.AccountId == AccountId);

            if (category == null)
                return RedirectToAction("Index");

            var model = new EditModel
            {
                Id = id,
                Name = category.Name,
                PaymentCount = Searches.Payment.Count(x => x.CategoryId == id)
            };

            return View(model);
        }

        [HttpPost]
        public IActionResult Edit(EditModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            if (Searches.Category.Exists(x => x.Name == model.Name && x.CategoryId != model.Id && x.AccountId == AccountId))
            {
                model.Error = "The category with such a name already exists";
                return View(model);
            }

            var category = Searches.Category.SelectFirst(x => x.CategoryId == model.Id && x.AccountId == AccountId);

            if (category != null)
            {
                category.Name = model.Name;

                Stores.Category.Update(category);
            }

            return RedirectToAction("Index");
        }

        public IActionResult Remove(int id)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var model = Searches.Category.BindFirst(
                x => new RemoveModel
                {
                    Id = id,
                    Name = x.Name,
                    PaymentCount = x.Payments.Count
                },
                x => x.CategoryId == id && x.AccountId == AccountId
            );

            if (model == null)
                return RedirectToAction("Index");

            return View(model);
        }

        [HttpPost]
        public IActionResult Remove(RemoveModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            var category = Searches.Category.SelectFirst(x => x.CategoryId == model.Id && x.AccountId == AccountId);

            if (category != null && !Searches.Payment.Exists(x => x.CategoryId == model.Id))
                Stores.Category.Delete(category);

            return RedirectToAction("Index");
        }
    }
}
