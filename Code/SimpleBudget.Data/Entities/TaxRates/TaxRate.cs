using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class TaxRate
    {
        public int TaxRateId { get; set;}
        public int AccountId { get; set; }
        public string? Name { get; set; }
        public int PeriodYear { get; set; }
        public decimal Rate { get; set; }
        public decimal MaxAmount { get; set; }

        public Account Account { get; set; } = default!;
    }

    public class TaxRateConfiguration : IEntityTypeConfiguration<TaxRate>
    {
        public void Configure(EntityTypeBuilder<TaxRate> builder)
        {
            builder.ToTable("TaxRate", "dbo");
            builder.HasKey(x => x.TaxRateId);

            builder.Property(nameof(TaxRate.Rate)).HasPrecision(18, 4);

            builder.HasOne(a => a.Account)
                .WithMany(b => b.TaxRates)
                .HasForeignKey(a => a.AccountId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
