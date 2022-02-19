namespace SimpleBudget.Data
{
    public static class Searches
    {
        public static AccountSearch Account { get; } = new AccountSearch();
        public static CategorySearch Category { get; } = new CategorySearch();
        public static CompanySearch Company { get; } = new CompanySearch();
        public static CurrencySearch Currency { get; } = new CurrencySearch();
        public static CurrencyRateSearch CurrencyRate { get; } = new CurrencyRateSearch();
        public static PaymentSearch Payment { get; } = new PaymentSearch();
        public static PlanPaymentSearch PlanPayment { get; } = new PlanPaymentSearch();
        public static PersonSearch Person { get; } = new PersonSearch();
        public static WalletSearch Wallet { get; } = new WalletSearch();
        public static TaxRateSearch Tax { get; } = new TaxRateSearch();
        public static TaxSettingSearch TaxSetting { get; } = new TaxSettingSearch();
        public static TaxYearSearch TaxYear { get; } = new TaxYearSearch();
        public static UserSearch User { get; } = new UserSearch();
        public static ReportSearch Report { get; } = new ReportSearch();
    }
}
