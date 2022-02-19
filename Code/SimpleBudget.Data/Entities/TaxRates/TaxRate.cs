using System.Data.Entity.ModelConfiguration;

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

        public virtual Account Account { get; set; } = default!;
    }

    public class TaxRateConfiguration : EntityTypeConfiguration<TaxRate>
    {
        public TaxRateConfiguration()
        {
            ToTable("dbo.TaxRate");
            HasKey(x => x.TaxRateId);

            HasRequired(a => a.Account).WithMany(b => b.TaxRates).HasForeignKey(a => a.AccountId).WillCascadeOnDelete(false);
        }
    }
}
