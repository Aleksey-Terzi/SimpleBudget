using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class CurrencyRate
    {
        public int CurrencyRateId { get; set; }
        public int CurrencyId { get; set; }
        public DateTime StartDate { get; set; }
        public decimal Rate { get; set; }
        public bool BankOfCanada { get; set; }

        public Currency Currency { get; set; } = default!;
    }

    public class CurrencyRateConfiguration : IEntityTypeConfiguration<CurrencyRate>
    {
        public void Configure(EntityTypeBuilder<CurrencyRate> builder)
        {
            builder.ToTable("CurrencyRate", "dbo");
            builder.HasKey(x => x.CurrencyRateId);

            builder.HasOne(a => a.Currency)
                .WithMany(b => b.CurrencyRates)
                .HasForeignKey(a => a.CurrencyId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
