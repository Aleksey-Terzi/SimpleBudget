using System.ComponentModel.DataAnnotations;

namespace SimpleBudget.API.Models
{
    public class UploadFileModel
    {
        [Required]
        public IFormFile File { get; set; } = default!;
    }
}
