using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int WalletId { get; set; }
        public int? CategoryId { get; set; }
        public int? CompanyId { get; set; }
        public int? PersonId { get; set; }
        public int? ParentPaymentId { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal Value { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedByUserId { get; set; }
        public DateTime ModifiedOn { get; set; }
        public int ModifiedByUserId { get; set; }
        public bool Taxable { get; set; }
        public int? TaxYear { get; set; }

        public ICollection<Payment> Children { get; set; } = new HashSet<Payment>();

        public Wallet Wallet { get; set; } = default!;
        public Category Category { get; set; } = default!;
        public Company Company { get; set; } = default!;
        public Person Person { get; set; } = default!;
        public User CreatedByUser { get; set; } = default!;
        public User ModifiedByUser { get; set; } = default!;
        public Payment Parent { get; set; } = default!;
    }

    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable("Payment", "dbo");
            builder.HasKey(x => x.PaymentId);

            builder.HasOne(a => a.Wallet)
                .WithMany(b => b.Payments)
                .HasForeignKey(a => a.WalletId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.CreatedByUser)
                .WithMany(b => b.CreatedPayments)
                .HasForeignKey(a => a.CreatedByUserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.ModifiedByUser)
                .WithMany(b => b.ModifiedPayments)
                .HasForeignKey(a => a.ModifiedByUserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Category)
                .WithMany(b => b.Payments)
                .HasForeignKey(a => a.CategoryId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Company)
                .WithMany(b => b.Payments)
                .HasForeignKey(a => a.CompanyId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Person)
                .WithMany(b => b.Payments)
                .HasForeignKey(a => a.PersonId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Parent)
                .WithMany(b => b.Children)
                .HasForeignKey(a => a.ParentPaymentId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
