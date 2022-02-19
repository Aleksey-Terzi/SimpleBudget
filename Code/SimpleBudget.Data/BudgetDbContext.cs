using System.Data.Entity;

namespace SimpleBudget.Data
{
    class BudgetDbContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; } = default!;
        public DbSet<Category> Categories { get; set; } = default!;
        public DbSet<Company> Companies { get; set; } = default!;
        public DbSet<Currency> Currencies { get; set; } = default!;
        public DbSet<CurrencyRate> CurrencyRates { get; set; } = default!;
        public DbSet<Payment> Payments { get; set; } = default!;
        public DbSet<PlanPayment> PlanPayments { get; set; } = default!;
        public DbSet<Person> Persons { get; set; } = default!;
        public DbSet<TaxRate> TaxRates { get; set; } = default!;
        public DbSet<TaxSetting> TaxSettings { get; set; } = default!;
        public DbSet<TaxYear> TaxYears { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Wallet> Wallets { get; set; } = default!;

        static BudgetDbContext()
        {
            Database.SetInitializer<BudgetDbContext>(null);
        }

        public BudgetDbContext()
            : base(Constants.BudgetConnectionString)
        {
        }

        protected override void OnModelCreating(DbModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Configurations.Add(new AccountConfiguration());
            builder.Configurations.Add(new CategoryConfiguration());
            builder.Configurations.Add(new CompanyConfiguration());
            builder.Configurations.Add(new CurrencyConfiguration());
            builder.Configurations.Add(new CurrencyRateConfiguration());
            builder.Configurations.Add(new PaymentConfiguration());
            builder.Configurations.Add(new PlanPaymentConfiguration());
            builder.Configurations.Add(new PersonConfiguration());
            builder.Configurations.Add(new TaxRateConfiguration());
            builder.Configurations.Add(new TaxSettingConfiguration());
            builder.Configurations.Add(new TaxYearConfiguration());
            builder.Configurations.Add(new UserConfiguration());
            builder.Configurations.Add(new WalletConfiguration());
        }
    }
}
