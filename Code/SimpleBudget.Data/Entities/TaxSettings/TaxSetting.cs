using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class TaxSetting
    {
        public int TaxSettingId { get; set; }
        public int AccountId { get; set; }
        public string? Name { get; set; }
        public int PeriodYear { get; set; }
        public decimal Value { get; set; }

        public virtual Account Account { get; set; } = default!;
    }

    public class TaxSettingConfiguration : EntityTypeConfiguration<TaxSetting>
    {
        public TaxSettingConfiguration()
        {
            ToTable("dbo.TaxSetting");
            HasKey(x => x.TaxSettingId);

            HasRequired(a => a.Account).WithMany(b => b.TaxSettings).HasForeignKey(a => a.AccountId).WillCascadeOnDelete(false);
        }
    }
}
