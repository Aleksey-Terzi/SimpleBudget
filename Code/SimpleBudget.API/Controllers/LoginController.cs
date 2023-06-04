using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;

namespace SimpleBudget.API.Controllers
{
    public class LoginController : BaseApiController
    {
        private readonly TokenService _tokenService;

        public LoginController(TokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpPost]
        public async Task<ActionResult<LoginResponseModel>> Login(LoginRequestModel model)
        {
            var result = await _tokenService.GenerateTokenAsync(model.Username, model.Password);

            if (string.IsNullOrEmpty(result.Token))
                return Unauthorized();

            var cookieOptions = new CookieOptions
            {
                Expires = DateTime.Now.AddMonths(1),
                SameSite = SameSiteMode.None,
                Secure = true
            };

            Response.Cookies.Append("username", model.Username, cookieOptions);

            return new LoginResponseModel
            {
                Token = result.Token
            };
        }
    }
}
