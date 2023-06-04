using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; } = default!;
        public string Password { get; set; } = default!;

        public ICollection<Payment> CreatedPayments { get; set; } = new HashSet<Payment>();
        public ICollection<Payment> ModifiedPayments { get; set; } = new HashSet<Payment>();
        public ICollection<PlanPayment> CreatedPlanPayments { get; set; } = new HashSet<PlanPayment>();
        public ICollection<PlanPayment> ModifiedPlanPayments { get; set; } = new HashSet<PlanPayment>();
    }

    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("User", "dbo");
            builder.HasKey(x => x.UserId);
        }
    }
}