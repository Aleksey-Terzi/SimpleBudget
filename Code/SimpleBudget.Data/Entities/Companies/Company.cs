using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class Company
    {
        public int CompanyId { get; set; }
        public int AccountId { get; set; }
        public string Name { get; set; } = default!;

        public virtual Account Account { get; set; } = default!;

        public virtual ICollection<Payment> Payments { get; set; } = new HashSet<Payment>();
        public virtual ICollection<PlanPayment> PlanPayments { get; set; } = new HashSet<PlanPayment>();
    }

    public class CompanyConfiguration : EntityTypeConfiguration<Company>
    {
        public CompanyConfiguration()
        {
            ToTable("dbo.Company");
            HasKey(x => x.CompanyId);

            HasRequired(a => a.Account).WithMany(b => b.Companies).HasForeignKey(a => a.AccountId).WillCascadeOnDelete(false);
        }
    }
}
