namespace SimpleBudget.API
{
    public class FormatHelper
    {
        public static string FormatValue(decimal value, string format)
            => string.Format(format, Math.Abs(value));

        public static string FormatRate(decimal rate)
            => $"{rate:####0.0000}";
    }
}
