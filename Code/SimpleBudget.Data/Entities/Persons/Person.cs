using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class Person
    {
        public int PersonId { get; set; }
        public int AccountId { get; set; }
        public string Name { get; set; } = default!;

        public virtual Account Account { get; set; } = default!;

        public virtual ICollection<Wallet> Wallets { get; set; } = new HashSet<Wallet>();
        public virtual ICollection<Payment> Payments { get; set; } = new HashSet<Payment>();
        public virtual ICollection<PlanPayment> PlanPayments { get; set; } = new HashSet<PlanPayment>();
        public virtual ICollection<TaxYear> TaxYears { get; set; } = new HashSet<TaxYear>();
    }

    public class PersonConfiguration : EntityTypeConfiguration<Person>
    {
        public PersonConfiguration()
        {
            ToTable("dbo.Person");
            HasKey(x => x.PersonId);

            HasRequired(a => a.Account).WithMany(b => b.Persons).HasForeignKey(a => a.AccountId).WillCascadeOnDelete(false);
        }
    }
}