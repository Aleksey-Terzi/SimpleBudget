using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SimpleBudget.Web.Controllers
{
    [Authorize]
    public class DictionariesController : BaseController
    {
        public IActionResult Index()
        {
            ViewData["menu"] = WebConstants.MenuActions.Dictionaries;

            return View();
        }
    }
}
