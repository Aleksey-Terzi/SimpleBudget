using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class NewImportModel
    {
        [Required]
        public string Wallet { get; set; } = default!;

        [Required]
        public List<NewImportPaymentModel> Payments { get; set; } = default!;
    }
}
