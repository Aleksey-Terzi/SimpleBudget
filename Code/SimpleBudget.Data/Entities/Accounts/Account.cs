using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class Account
    {
        public int AccountId { get; set; }
        public string? Name { get; set; }

        public virtual ICollection<Category> Categories { get; set; } = new HashSet<Category>();
        public virtual ICollection<Company> Companies { get; set; } = new HashSet<Company>();
        public virtual ICollection<Currency> Currencies { get; set; } = new HashSet<Currency>();
        public virtual ICollection<Person> Persons { get; set; } = new HashSet<Person>();
        public virtual ICollection<Wallet> Wallets { get; set; } = new HashSet<Wallet>();
        public virtual ICollection<TaxRate> TaxRates { get; set; } = new HashSet<TaxRate>();
        public virtual ICollection<TaxSetting> TaxSettings { get; set; } = new HashSet<TaxSetting>();
    }

    public class AccountConfiguration : EntityTypeConfiguration<Account>
    {
        public AccountConfiguration()
        {
            ToTable("dbo.Account");
            HasKey(x => x.AccountId);
        }
    }
}
