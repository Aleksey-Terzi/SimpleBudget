namespace SimpleBudget.API
{
    public class TimeHelper
    {
        static Dictionary<int, TimeZoneInfo> _timeZones;

        static TimeHelper()
        {
            _timeZones = new Dictionary<int, TimeZoneInfo>();

            foreach (var zone in TimeZoneInfo.GetSystemTimeZones())
            {
                var offset = -(int)zone.BaseUtcOffset.TotalMinutes;
                if (!_timeZones.ContainsKey(offset))
                    _timeZones.Add(offset, zone);
            }
        }

        private readonly TimeZoneInfo _zone;

        public TimeHelper(int timezoneOffset)
        {
            _zone = _timeZones.TryGetValue(timezoneOffset, out var zone)
                ? zone
                : TimeZoneInfo.Utc;
        }

        public DateTime GetLocalTime()
        {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _zone);
        }
    }
}
