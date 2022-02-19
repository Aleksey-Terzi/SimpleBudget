using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; } = default!;
        public string Password { get; set; } = default!;

        public virtual ICollection<Payment> CreatedPayments { get; set; } = new HashSet<Payment>();
        public virtual ICollection<Payment> ModifiedPayments { get; set; } = new HashSet<Payment>();
        public virtual ICollection<PlanPayment> CreatedPlanPayments { get; set; } = new HashSet<PlanPayment>();
        public virtual ICollection<PlanPayment> ModifiedPlanPayments { get; set; } = new HashSet<PlanPayment>();
    }

    public class UserConfiguration : EntityTypeConfiguration<User>
    {
        public UserConfiguration()
        {
            ToTable("dbo.User");
            HasKey(x => x.UserId);
        }
    }
}