using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;

namespace SimpleBudget.API.Controllers
{
    public class LoginController : BaseApiController
    {
        private readonly TokenService _tokenService;
        private readonly ClientLockService _lockService;

        public LoginController(TokenService tokenService, ClientLockService lockService)
        {
            _tokenService = tokenService;
            _lockService = lockService;
        }

        [HttpPost]
        public async Task<ActionResult<LoginResponseModel>> Login(LoginRequestModel model)
        {
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString();
            
            if (_lockService.IsLocked(model.Username, ipAddress))
                return Unauthorized("You are blocked from logging in for 15 min");

            var result = await _tokenService.GenerateTokenAsync(model.Username, model.Password);
            if (result.Status != TokenService.Status.Success)
            {
                _lockService.Fail(model.Username, ipAddress);
                return Unauthorized("Username or password is incorrect");
            }

            if (_lockService.Success(model.Username, ipAddress) == ClientLockService.Status.Locked)
                return Unauthorized("You are blocked from logging in for 15 min");

            var cookieOptions = new CookieOptions
            {
                Expires = DateTime.Now.AddMonths(1),
                SameSite = SameSiteMode.None,
                Secure = true
            };

            Response.Cookies.Append("username", model.Username, cookieOptions);

            return new LoginResponseModel
            {
                Token = result.Token!
            };
        }
    }
}
