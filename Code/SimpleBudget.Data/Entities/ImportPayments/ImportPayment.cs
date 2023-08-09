using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class ImportPayment
    {
        public string ImportPaymentCode { get; set; } = default!;
		public int AccountId { get; set; }
        public int? CategoryId { get; set; }
        public int? CompanyId { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedByUserId { get; set; }
        public DateTime ModifiedOn { get; set; }
        public int ModifiedByUserId { get; set; }

        public Account Account { get; set; } = default!;
        public Category? Category { get; set; }
        public Company? Company { get; set; }
        public User CreatedByUser { get; set; } = default!;
        public User ModifiedByUser { get; set; } = default!;
    }

    public class ImportPaymentConfiguration : IEntityTypeConfiguration<ImportPayment>
    {
        public void Configure(EntityTypeBuilder<ImportPayment> builder)
        {
            builder.ToTable("ImportPayment", "dbo");
            builder.HasKey(x => x.ImportPaymentCode);

            builder.HasOne(a => a.Account)
                .WithMany(b => b.ImportPayments)
                .HasForeignKey(a => a.AccountId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Category)
                .WithMany(b => b.ImportPayments)
                .HasForeignKey(a => a.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Company)
                .WithMany(b => b.ImportPayments)
                .HasForeignKey(a => a.CompanyId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.CreatedByUser)
                .WithMany(b => b.CreatedImportPayments)
                .HasForeignKey(a => a.CreatedByUserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.ModifiedByUser)
                .WithMany(b => b.ModifiedImportPayments)
                .HasForeignKey(a => a.ModifiedByUserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
