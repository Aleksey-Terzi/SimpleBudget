using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class Company
    {
        public int CompanyId { get; set; }
        public int AccountId { get; set; }
        public string Name { get; set; } = default!;

        public Account Account { get; set; } = default!;

        public ICollection<Payment> Payments { get; set; } = new HashSet<Payment>();
        public ICollection<PlanPayment> PlanPayments { get; set; } = new HashSet<PlanPayment>();
    }

    public class CompanyConfiguration : IEntityTypeConfiguration<Company>
    {
        public void Configure(EntityTypeBuilder<Company> builder)
        {
            builder.ToTable("Company", "dbo");
            builder.HasKey(x => x.CompanyId);

            builder.HasOne(a => a.Account)
                .WithMany(b => b.Companies)
                .HasForeignKey(a => a.AccountId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
