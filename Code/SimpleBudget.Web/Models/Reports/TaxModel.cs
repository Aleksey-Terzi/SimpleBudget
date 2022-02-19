namespace SimpleBudget.Web.Models.Reports
{
    public class TaxModel
    {
        public class PersonItem
        {
            public int PersonId { get; set; }
            public string Name { get; set; } = default!;
        }

        public class IncomeItem
        {
            public int PaymentId { get; set; }
            public DateTime PaymentDate { get; set; }
            public string? CompanyName { get; set; }
            public string? Description { get; set; }
            public string? CategoryName { get; set; }
            public string WalletName { get; set; } = default!;
            public string CurrencyCode { get; set; } = default!;
            public string ValueFormat { get; set; } = default!;
            public decimal Value { get; set; }
            public decimal Rate { get; set; }
            public string ValueFormatCAD { get; set; } = default!;
            public decimal ValueCAD => Rate * Value;

            public string FormattedPaymentDate => $"{PaymentDate:MMM d, yyyy}";

            public string FormattedValue => string.Format(ValueFormat, Value);

            public string FormattedValueCAD
            {
                get
                {
                    var text = string.Format(ValueFormatCAD, ValueCAD);
                    return Rate == 0 ? $"<span style='color:red;'>{text}</span>" : text;
                }
            }

            public string FormattedRate => $"{Rate:####0.0000}";
        }

        public class TaxItem
        {
            public string Name { get; set; } = default!;
            public decimal Value { get; set; }
            public decimal ValuePaid { get; set; }
            public string ValueFormat { get; set; } = default!;

            public string FormattedValue => string.Format(ValueFormat, Value);
            public string FormattedValuePaid => string.Format(ValueFormat, ValuePaid);
            public string FormattedDiff
            {
                get
                {
                    var diff = ValuePaid - Value;
                    var text = string.Format(ValueFormat, Math.Abs(diff));

                    return diff == 0
                        ? text
                        : (diff < 0 ? $"<span style='color:red;'>{text}</span>" : $"<span style='color:green;'>{text}</span>");
                }
            }
        }

        public List<int> Years { get; set; } = default!;
        public List<PersonItem> Persons { get; set; } = default!;
        public List<IncomeItem> IncomeItems { get; set; } = default!;
        public List<TaxItem> TaxItems { get; set; } = default!;

        public int? SelectedPersonId { get; set; }
        public int SelectedYear { get; set; }
        public string ValueFormat { get; set; } = default!;
        public DateTime? Closed { get; set; }

        public decimal IncomeTotalValue
            => IncomeItems.Count == 0 || IncomeItems.FirstOrDefault(x => x.Rate == 0) != null
            ? 0
            : IncomeItems.Sum(x => x.ValueCAD);

        public string FormattedIncomeTotalValue
        {
            get
            {
                var text = string.Format(ValueFormat, IncomeTotalValue);
                return IncomeTotalValue == 0 ? $"<span style='color:red;'>{text}</span>" : text;
            }
        }

        public decimal TaxTotalValue
            => TaxItems.Count > 0 ? TaxItems.Sum(x => x.Value) : 0;

        public string FormattedTaxTotal
            => string.Format(ValueFormat, TaxTotalValue);

        public decimal TaxPaidTotal
            => TaxItems.Count > 0 ? TaxItems.Sum(x => x.ValuePaid) : 0;

        public string FormattedTaxPaidTotal
            => string.Format(ValueFormat, TaxPaidTotal);

        public string FormattedTaxDiffTotal
        {
            get
            {
                var diff = TaxPaidTotal - TaxTotalValue;
                var text = string.Format(ValueFormat, Math.Abs(diff));

                return diff == 0
                    ? text
                    : (diff < 0 ? $"<span style='color:red;'>{text}</span>" : $"<span style='color:green;'>{text}</span>");
            }
        }
    }
}