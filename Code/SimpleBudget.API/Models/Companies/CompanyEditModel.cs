using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class CompanyEditModel
    {
        [Required]
        public string Name { get; set; } = default!;

        public int PaymentCount { get; set; }
    }
}
