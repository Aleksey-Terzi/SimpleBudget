namespace SimpleBudget.Web.Models.Reports
{
    public class SummaryModel
    {
        public class WalletItem
        {
            public string WalletName { get; set; } = default!;
            public string CurrencyCode { get; set; } = default!;
            public string ValueFormat { get; set; } = default!;
            public decimal Value { get; set; }
            public decimal Rate { get; set; }
            public string ValueFormatCAD { get; set; } = default!;

            public string FormattedValue => FormatValue(ValueFormat, Value);
            public string FormattedValueCAD => FormatValue(ValueFormatCAD, Value * Rate);
            public string FormattedRate => $"{Rate:####0.0000}";
        }

        public class CurrencyItem
        {
            public string CurrencyCode { get; set; } = default!;
            public string ValueFormat { get; set; } = default!;
            public decimal Value { get; set; }
            public decimal Rate { get; set; }
            public string ValueFormatCAD { get; set; } = default!;

            public string FormattedValue => FormatValue(ValueFormat, Value);
            public string FormattedValueCAD => FormatValue(ValueFormatCAD, Value * Rate);
            public string FormattedRate => $"{Rate:####0.0000}";
        }

        public bool DeductUnpaidTaxes { get; set; }
        public string ValueFormatCAD { get; set; } = default!;
        public List<WalletItem> WalletItems { get; set; } = default!;
        public List<CurrencyItem> CurrencyItems { get; set; } = default!;
        public decimal Tax { get; set; }

        public string FormattedTotalWallet => FormatTotalValue(WalletItems.Count > 0 ? WalletItems.Sum(x => x.Value * x.Rate) : 0);
        public string FormattedTotalCurrency => FormatTotalValue(CurrencyItems.Count > 0 ? CurrencyItems.Sum(x => x.Value * x.Rate) : 0);

        private string FormatTotalValue(decimal value)
        {
            if (Tax == 0)
                return FormatValue(ValueFormatCAD, value);

            return $"{FormatValue(ValueFormatCAD, value)} - {string.Format(ValueFormatCAD, Tax)} = {FormatValue(ValueFormatCAD, value - Tax)}";
        }

        private static string FormatValue(string valueFormat, decimal value)
        {
            var text = string.Format(valueFormat, Math.Abs(value));

            if (value == 0)
                return text;

            return value > 0 ? $"<span style='color:green;'>{text}</span>" : $"<span style='color:red;'>{text}</span>";
        }
    }
}