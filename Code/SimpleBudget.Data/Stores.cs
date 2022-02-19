namespace SimpleBudget.Data
{
    public static class Stores
    {
        public static AccountStore Account { get; } = new AccountStore();
        public static CategoryStore Category { get; } = new CategoryStore();
        public static CompanyStore Company { get; } = new CompanyStore();
        public static CurrencyStore Currency { get; } = new CurrencyStore();
        public static CurrencyRateStore CurrencyRate { get; } = new CurrencyRateStore();
        public static PaymentStore Payment { get; } = new PaymentStore();
        public static PlanPaymentStore PlanPayment { get; } = new PlanPaymentStore();
        public static PersonStore Person { get; } = new PersonStore();
        public static TaxRateStore Tax { get; } = new TaxRateStore();
        public static TaxSettingStore TaxSetting { get; } = new TaxSettingStore();
        public static TaxYearStore TaxYear { get; } = new TaxYearStore();
        public static WalletStore Wallet { get; } = new WalletStore();
        public static UserStore User { get; } = new UserStore();
    }
}
