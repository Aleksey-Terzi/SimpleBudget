using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class Wallet
    {
        public int WalletId { get; set; }
        public int AccountId { get; set; }
        public int? PersonId { get; set; }
        public int CurrencyId { get; set; }
        public string Name { get; set; } = default!;

        public virtual Account Account { get; set; } = default!;
        public virtual Person Person { get; set; } = default!;
        public virtual Currency Currency { get; set; } = default!;

        public virtual ICollection<Payment> Payments { get; set; } = new HashSet<Payment>();
        public virtual ICollection<PlanPayment> PlanPayments { get; set; } = new HashSet<PlanPayment>();
    }

    public class WalletConfiguration : EntityTypeConfiguration<Wallet>
    {
        public WalletConfiguration()
        {
            ToTable("dbo.Wallet");
            HasKey(x => x.WalletId);

            HasRequired(a => a.Account).WithMany(b => b.Wallets).HasForeignKey(a => a.AccountId).WillCascadeOnDelete(false);
            HasRequired(a => a.Currency).WithMany(b => b.Wallets).HasForeignKey(a => a.CurrencyId).WillCascadeOnDelete(false);
            HasOptional(a => a.Person).WithMany(b => b.Wallets).HasForeignKey(a => a.PersonId).WillCascadeOnDelete(false);
        }
    }
}