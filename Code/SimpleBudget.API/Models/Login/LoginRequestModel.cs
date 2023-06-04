using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class LoginRequestModel
    {
        [Required]
        public string Username { get; set; } = default!;

        [Required]
        public string Password { get; set; } = default!;
    }
}
