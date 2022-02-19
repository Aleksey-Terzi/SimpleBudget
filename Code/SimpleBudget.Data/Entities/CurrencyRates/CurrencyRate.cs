using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class CurrencyRate
    {
        public int CurrencyRateId { get; set; }
        public int CurrencyId { get; set; }
        public DateTime StartDate { get; set; }
        public decimal Rate { get; set; }
        public bool BankOfCanada { get; set; }

        public virtual Currency Currency { get; set; } = default!;
    }

    public class CurrencyRateConfiguration : EntityTypeConfiguration<CurrencyRate>
    {
        public CurrencyRateConfiguration()
        {
            ToTable("dbo.CurrencyRate");
            HasKey(x => x.CurrencyRateId);

            HasRequired(a => a.Currency).WithMany(b => b.CurrencyRates).HasForeignKey(a => a.CurrencyId).WillCascadeOnDelete(false);
        }
    }
}
