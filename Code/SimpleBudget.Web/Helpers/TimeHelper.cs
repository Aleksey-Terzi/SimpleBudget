namespace SimpleBudget.Web
{
    public static class TimeHelper
    {
        public static TimeZoneInfo TimeZone { get; private set; } = TimeZoneInfo.Utc;

        public static void SetTimeZone(string timeZone)
        {
            TimeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
        }

        public static DateTime GetLocalTime()
        {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZone);
        }
    }
}
