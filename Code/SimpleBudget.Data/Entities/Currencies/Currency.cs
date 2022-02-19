using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class Currency
    {
        public int CurrencyId { get; set; }
        public int AccountId { get; set; }
        public string Code { get; set; } = default!;
        public string ValueFormat { get; set; } = "{0:n2}";

        public virtual Account Account { get; set; } = default!;

        public virtual ICollection<CurrencyRate> CurrencyRates { get; set; } = new HashSet<CurrencyRate>();
        public virtual ICollection<Wallet> Wallets { get; set; } = new HashSet<Wallet>();
    }

    public class CurrencyConfiguration : EntityTypeConfiguration<Currency>
    {
        public CurrencyConfiguration()
        {
            ToTable("dbo.Currency");
            HasKey(x => x.CurrencyId);

            HasRequired(a => a.Account).WithMany(b => b.Currencies).HasForeignKey(a => a.AccountId).WillCascadeOnDelete(false);
        }
    }
}
