using System.Security.Claims;

namespace SimpleBudget.API
{
    public class IdentityService
    {
        public HttpContext HttpContext { get; set; } = default!;

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

        private TimeHelper? _timeHelper;
        public TimeHelper TimeHelper
        {
            get
            {
                InitTimeHelper();
                return _timeHelper!;
            }
        }

        private void InitTimeHelper()
        {
            if (_timeHelper != null)
                return;

            if (HttpContext.Request.Headers["X-Time-Zone-Offset"].Count == 0)
                _timeHelper = new TimeHelper(0);
            else
            {
                var timezoneOffsetText = HttpContext.Request.Headers["X-Time-Zone-Offset"][0];
                if (!int.TryParse(timezoneOffsetText, out var timezoneOffset))
                    throw new ArgumentException($"Invalid header X-Time-Zone-Offset value: {timezoneOffsetText}");

                _timeHelper = new TimeHelper(timezoneOffset);
            }
        }
    }
}
