using System.Security.Claims;

using Microsoft.AspNetCore.Mvc;

namespace SimpleBudget.Web.Controllers
{
    public abstract class BaseController : Controller
    {
        public int AccountId => 1;

        private int? _userID;
        public int UserId
        {
            get
            {
                if (_userID == null)
                {
                    var claim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);

                    if (claim == null)
                        throw new ArgumentNullException("NameIdentifier");

                    _userID = int.Parse(claim.Value);
                }

                return _userID.Value;
            }
        }
    }
}
