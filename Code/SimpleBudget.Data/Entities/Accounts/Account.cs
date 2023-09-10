using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class Account
    {
        public int AccountId { get; set; }
        public string? Name { get; set; }

        public ICollection<Category> Categories { get; set; } = new HashSet<Category>();
        public ICollection<Company> Companies { get; set; } = new HashSet<Company>();
        public ICollection<Currency> Currencies { get; set; } = new HashSet<Currency>();
        public ICollection<ImportPayment> ImportPayments { get; set; } = new HashSet<ImportPayment>();
        public ICollection<Person> Persons { get; set; } = new HashSet<Person>();
        public ICollection<Product> Products { get; set; } = new HashSet<Product>();
        public ICollection<TaxRate> TaxRates { get; set; } = new HashSet<TaxRate>();
        public ICollection<TaxSetting> TaxSettings { get; set; } = new HashSet<TaxSetting>();
        public ICollection<Wallet> Wallets { get; set; } = new HashSet<Wallet>();
    }

    public class AccountConfiguration : IEntityTypeConfiguration<Account>
    {
        public void Configure(EntityTypeBuilder<Account> builder)
        {
            builder.ToTable("Account", "dbo");
            builder.HasKey(x => x.AccountId);
        }
    }
}
