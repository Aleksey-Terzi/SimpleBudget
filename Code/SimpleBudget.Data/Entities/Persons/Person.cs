using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class Person
    {
        public int PersonId { get; set; }
        public int AccountId { get; set; }
        public string Name { get; set; } = default!;

        public Account Account { get; set; } = default!;

        public ICollection<Wallet> Wallets { get; set; } = new HashSet<Wallet>();
        public ICollection<Payment> Payments { get; set; } = new HashSet<Payment>();
        public ICollection<PlanPayment> PlanPayments { get; set; } = new HashSet<PlanPayment>();
        public ICollection<TaxYear> TaxYears { get; set; } = new HashSet<TaxYear>();
    }

    public class PersonConfiguration : IEntityTypeConfiguration<Person>
    {
        public void Configure(EntityTypeBuilder<Person> builder)
        {
            builder.ToTable("Person", "dbo");
            builder.HasKey(x => x.PersonId);

            builder.HasOne(a => a.Account)
                .WithMany(b => b.Persons)
                .HasForeignKey(a => a.AccountId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}