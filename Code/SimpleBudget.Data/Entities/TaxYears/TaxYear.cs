using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class TaxYear
    {
        public int Year { get; set; }
        public int PersonId { get; set; }
        public decimal FinalTaxAmount { get; set; }
        public DateTime Closed { get; set; }

        public Person Person { get; set; } = default!;
    }

    public class TaxYearConfiguration : IEntityTypeConfiguration<TaxYear>
    {
        public void Configure(EntityTypeBuilder<TaxYear> builder)
        {
            builder.ToTable("TaxYear", "dbo");
            builder.HasKey(x => new { x.Year, x.PersonId });

            builder.HasOne(a => a.Person)
                .WithMany(b => b.TaxYears)
                .HasForeignKey(a => a.PersonId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
