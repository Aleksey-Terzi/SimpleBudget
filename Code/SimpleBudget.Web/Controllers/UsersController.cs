using System.Security.Claims;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.Data;
using SimpleBudget.Web.Models.Users;

namespace SimpleBudget.Web.Controllers
{
    public class UsersController : Controller
    {
        private readonly ILogger _logger;

        public UsersController(ILogger<UsersController> logger)
        {
            _logger = logger;
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();

            return LocalRedirect("/users/login");
        }

        public IActionResult Login()
        {
            var model = new LoginModel
            {
                Username = Request.Cookies["Username"]
            };

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
            {
                model.Error = "Username and password are required fields";
            }
            else
            {
                var user = Searches.User.SelectFirst(x => x.Name == model.Username && x.Password == model.Password);

                if (user != null)
                {
                    await Authenticate(user);

                    Response.Cookies.Append("Username", model.Username, new CookieOptions { Expires = DateTime.Now.AddMonths(1) });

                    return LocalRedirect(model.RedirectUrl ?? "/");
                }

                model.Error = "Username or password is incorrect";
            }

            return View(model);
        }

        private async Task Authenticate(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                IssuedUtc = DateTime.UtcNow,
                ExpiresUtc = DateTime.UtcNow.AddMonths(1)
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity),
                authProperties
            );

            _logger.LogInformation("User {Email} logged in at {Time} UTC.", user.Name, DateTime.UtcNow);
        }
    }
}
