namespace SimpleBudget.Web.Models.Wallets
{
    public class EditModel
    {
        public class PersonItem
        {
            public int PersonId { get; set; }
            public string Name { get; set; } = default!;
        }

        public class CurrencyItem
        {
            public int CurrencyId { get; set; }
            public string Code { get; set; } = default!;
        }

        public int Id { get; set; }
        public int? PersonId { get; set; }
        public int CurrencyId { get; set; }
        public string Name { get; set; } = default!;
        public int? PaymentCount { get; set; }

        public List<PersonItem> Persons { get; set; } = default!;
        public List<CurrencyItem> Currencies { get; set; } = default!;

        public string? Error { get; set; }
    }
}
