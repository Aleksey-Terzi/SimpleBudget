using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class PlanPayment
    {
        public int PlanPaymentId { get; set; }
        public int WalletId { get; set; }
        public int? CategoryId { get; set; }
        public int? CompanyId { get; set; }
        public int? PersonId { get; set; }
        public DateTime PaymentStartDate { get; set; }
        public DateTime? PaymentEndDate { get; set; }
        public decimal Value { get; set; }
        public string? Description { get; set; }
        public bool Taxable { get; set; }
        public int? TaxYear { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedByUserId { get; set; }
        public DateTime ModifiedOn { get; set; }
        public int ModifiedByUserId { get; set; }

        public Wallet Wallet { get; set; } = default!;
        public Category Category { get; set; } = default!;
        public Company Company { get; set; } = default!;
        public Person Person { get; set; } = default!;
        public User CreatedByUser { get; set; } = default!;
        public User ModifiedByUser { get; set; } = default!;
    }

    public class PlanPaymentConfiguration : IEntityTypeConfiguration<PlanPayment>
    {
        public void Configure(EntityTypeBuilder<PlanPayment> builder)
        {
            builder.ToTable("PlanPayment", "dbo");
            builder.HasKey(x => x.PlanPaymentId);

            builder.HasOne(a => a.Wallet)
                .WithMany(b => b.PlanPayments)
                .HasForeignKey(a => a.WalletId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.CreatedByUser)
                .WithMany(b => b.CreatedPlanPayments)
                .HasForeignKey(a => a.CreatedByUserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.ModifiedByUser)
                .WithMany(b => b.ModifiedPlanPayments)
                .HasForeignKey(a => a.ModifiedByUserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Category)
                .WithMany(b => b.PlanPayments)
                .HasForeignKey(a => a.CategoryId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Company)
                .WithMany(b => b.PlanPayments)
                .HasForeignKey(a => a.CompanyId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Person)
                .WithMany(b => b.PlanPayments)
                .HasForeignKey(a => a.PersonId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
