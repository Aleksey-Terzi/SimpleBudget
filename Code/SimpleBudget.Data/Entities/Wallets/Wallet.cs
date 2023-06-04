using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class Wallet
    {
        public int WalletId { get; set; }
        public int AccountId { get; set; }
        public int? PersonId { get; set; }
        public int CurrencyId { get; set; }
        public string Name { get; set; } = default!;

        public Account Account { get; set; } = default!;
        public Person Person { get; set; } = default!;
        public Currency Currency { get; set; } = default!;

        public ICollection<Payment> Payments { get; set; } = new HashSet<Payment>();
        public ICollection<PlanPayment> PlanPayments { get; set; } = new HashSet<PlanPayment>();
    }

    public class WalletConfiguration : IEntityTypeConfiguration<Wallet>
    {
        public void Configure(EntityTypeBuilder<Wallet> builder)
        {
            builder.ToTable("Wallet", "dbo");
            builder.HasKey(x => x.WalletId);

            builder.HasOne(a => a.Account)
                .WithMany(b => b.Wallets)
                .HasForeignKey(a => a.AccountId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Currency)
                .WithMany(b => b.Wallets)
                .HasForeignKey(a => a.CurrencyId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Person)
                .WithMany(b => b.Wallets)
                .HasForeignKey(a => a.PersonId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}