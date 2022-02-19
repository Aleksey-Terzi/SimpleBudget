namespace SimpleBudget.Web.Models.Users
{
    public class LoginModel
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? RedirectUrl { get; set; }

        public string? Error { get; set; }
    }
}
