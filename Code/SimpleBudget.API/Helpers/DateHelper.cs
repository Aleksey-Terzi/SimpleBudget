using System.Globalization;

namespace SimpleBudget.API
{
    public static class DateHelper
    {
        public static string? Format(DateTime? value)
        {
            return value.HasValue
                ? $"{value:MMM d, yyyy}"
                : null;
        }

        public static string? ToClient(DateTime? value)
        {
            return value.HasValue
                ? $"{value:yyyy-MM-dd}"
                : null;
        }

        public static DateTime? ToServer(string? value)
        {
            return !string.IsNullOrEmpty(value)
                ? DateTime.ParseExact(value, @"yyyy-M-d", CultureInfo.InvariantCulture)
                : (DateTime?)null;
        }
    }
}
