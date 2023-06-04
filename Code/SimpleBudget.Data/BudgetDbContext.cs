using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class BudgetDbContext : DbContext
    {
        internal DbSet<Account> Accounts { get; set; } = default!;
        internal DbSet<Category> Categories { get; set; } = default!;
        internal DbSet<Company> Companies { get; set; } = default!;
        internal DbSet<Currency> Currencies { get; set; } = default!;
        internal DbSet<CurrencyRate> CurrencyRates { get; set; } = default!;
        internal DbSet<Payment> Payments { get; set; } = default!;
        internal DbSet<PlanPayment> PlanPayments { get; set; } = default!;
        internal DbSet<Person> Persons { get; set; } = default!;
        internal DbSet<TaxRate> TaxRates { get; set; } = default!;
        internal DbSet<TaxSetting> TaxSettings { get; set; } = default!;
        internal DbSet<TaxYear> TaxYears { get; set; } = default!;
        internal DbSet<User> Users { get; set; } = default!;
        internal DbSet<Wallet> Wallets { get; set; } = default!;

        public BudgetDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new AccountConfiguration());
            builder.ApplyConfiguration(new CategoryConfiguration());
            builder.ApplyConfiguration(new CompanyConfiguration());
            builder.ApplyConfiguration(new CurrencyConfiguration());
            builder.ApplyConfiguration(new CurrencyRateConfiguration());
            builder.ApplyConfiguration(new PaymentConfiguration());
            builder.ApplyConfiguration(new PlanPaymentConfiguration());
            builder.ApplyConfiguration(new PersonConfiguration());
            builder.ApplyConfiguration(new TaxRateConfiguration());
            builder.ApplyConfiguration(new TaxSettingConfiguration());
            builder.ApplyConfiguration(new TaxYearConfiguration());
            builder.ApplyConfiguration(new UserConfiguration());
            builder.ApplyConfiguration(new WalletConfiguration());
        }
    }
}
