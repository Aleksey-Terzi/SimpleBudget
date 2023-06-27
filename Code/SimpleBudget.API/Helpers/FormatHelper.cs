namespace SimpleBudget.API
{
    public class FormatHelper
    {
        public static string FormatValue(decimal value, string format)
            => string.Format(format, Math.Abs(value));

        public static string? FormatValueOrNull(decimal? value, string format)
            => value.HasValue ? string.Format(format, Math.Abs(value.Value)) : null;

        public static string FormatRate(decimal rate)
            => $"{rate:####0.0000}";

        public static string? FormatPercent(decimal? rate)
        {
            if (rate == null)
                return null;

            return $"{rate:####0.00%}";
        }
    }
}
