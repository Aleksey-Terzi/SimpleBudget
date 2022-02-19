using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class TaxYear
    {
        public int Year { get; set; }
        public int PersonId { get; set; }
        public decimal FinalTaxAmount { get; set; }
        public DateTime Closed { get; set; }

        public virtual Person Person { get; set; } = default!;
    }

    public class TaxYearConfiguration : EntityTypeConfiguration<TaxYear>
    {
        public TaxYearConfiguration()
        {
            ToTable("dbo.TaxYear");
            HasKey(x => new { x.Year, x.PersonId });

            HasRequired(a => a.Person).WithMany(b => b.TaxYears).HasForeignKey(a => a.PersonId).WillCascadeOnDelete(false);
        }
    }
}
