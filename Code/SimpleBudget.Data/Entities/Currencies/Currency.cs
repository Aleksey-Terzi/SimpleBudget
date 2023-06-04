using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class Currency
    {
        public int CurrencyId { get; set; }
        public int AccountId { get; set; }
        public string Code { get; set; } = default!;
        public string ValueFormat { get; set; } = "{0:n2}";

        public Account Account { get; set; } = default!;

        public ICollection<CurrencyRate> CurrencyRates { get; set; } = new HashSet<CurrencyRate>();
        public ICollection<Wallet> Wallets { get; set; } = new HashSet<Wallet>();
    }

    public class CurrencyConfiguration : IEntityTypeConfiguration<Currency>
    {
        public void Configure(EntityTypeBuilder<Currency> builder)
        {
            builder.ToTable("Currency", "dbo");
            builder.HasKey(x => x.CurrencyId);

            builder.HasOne(a => a.Account)
                .WithMany(b => b.Currencies)
                .HasForeignKey(a => a.AccountId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
