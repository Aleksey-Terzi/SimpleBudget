namespace SimpleBudget.Data
{
    public static class Constants
    {
        public static string BudgetConnectionString { get; set; } = default!;

        public static class Tax
        {
            public const string CPP = "CPP";
            public const string EI = "EI";
            public const string FederalTax = "Federal Tax";
            public const string AlbertaTax = "Alberta Tax";
            public const string CPPBasicExemptionAmount = "CPP Basic Exemption Amount";
            public const string FederalBasicPersonalAmount = "Federal Basic Personal Amount";
            public const string AlbertaBasicPersonalAmount = "Alberta Basic Personal Amount";
            public const string CanadaEmploymentBaseAmount = "Canada Employment Base Amount";
        }

        public static class Company
        {
            public const string CPP = "CPP";
            public const string EI = "EI";
            public const string FederalTax = "Federal Tax";
            public const string ProvincialTax = "Provincial Tax";
        }

        public static class Category
        {
            public const string Taxes = "Taxes";
        }
    }
}
