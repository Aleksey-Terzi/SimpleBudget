using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class TaxSetting
    {
        public int TaxSettingId { get; set; }
        public int AccountId { get; set; }
        public string? Name { get; set; }
        public int PeriodYear { get; set; }
        public decimal Value { get; set; }

        public Account Account { get; set; } = default!;
    }

    public class TaxSettingConfiguration : IEntityTypeConfiguration<TaxSetting>
    {
        public void Configure(EntityTypeBuilder<TaxSetting> builder)
        {
            builder.ToTable("TaxSetting", "dbo");
            builder.HasKey(x => x.TaxSettingId);

            builder.HasOne(a => a.Account)
                .WithMany(b => b.TaxSettings)
                .HasForeignKey(a => a.AccountId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
