using Microsoft.AspNetCore.Mvc;

namespace SimpleBudget.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        public const int AccountId = 1;
        public const int UserId = 1;
    }
}
