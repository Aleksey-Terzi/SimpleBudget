namespace SimpleBudget.API
{
    public class ClientLockService
    {
        private class TryItem
        {
            public DateTime? Locked { get; set; }
            public int TryCount { get; set; }
        }

        private const int MaxTryCount = 3;
        private const int LockTimeInMinutes = 15;

        public enum Status { Locked, NotLocked }

        private static Dictionary<string, TryItem> _userTries = new Dictionary<string, TryItem>(StringComparer.OrdinalIgnoreCase);
        private static Dictionary<string, TryItem> _ipTries = new Dictionary<string, TryItem>(StringComparer.OrdinalIgnoreCase);
        private static object _syncRoot = new();

        public bool IsLocked(string username, string? ipAddress)
        {
            lock (_syncRoot)
            {
                return IsLocked(_userTries, username) || IsLocked(_ipTries, ipAddress);
            }
        }

        public Status Success(string username, string? ipAddress)
        {
            lock (_syncRoot)
            {
                if (IsLocked(_userTries, username) || IsLocked(_ipTries, ipAddress))
                    return Status.Locked;

                _userTries.Remove(username);

                if (!string.IsNullOrEmpty(ipAddress))
                    _ipTries.Remove(ipAddress);
            }

            return Status.NotLocked;
        }

        public Status Fail(string username, string? ipAddress)
        {
            lock (_syncRoot)
            {
                if (IsLocked(_userTries, username) || IsLocked(_ipTries, ipAddress))
                    return Status.Locked;

                var status = IncTry(_userTries, username);

                if (status == Status.Locked)
                {
                    Lock(_ipTries, ipAddress);
                }
                else
                {
                    status = IncTry(_ipTries, ipAddress);
                    if (status == Status.Locked)
                        Lock(_userTries, username);
                }

                return status;
            }
        }

        private static void Lock(Dictionary<string, TryItem> tries, string? key)
        {
            if (string.IsNullOrEmpty(key))
                return;

            if (!tries.TryGetValue(key, out var last))
                tries.Add(key, last = new TryItem());

            last.Locked = DateTime.UtcNow;
        }

        private static Status IncTry(Dictionary<string, TryItem> tries, string? key)
        {
            if (string.IsNullOrEmpty(key))
                return Status.NotLocked;

            if (!tries.TryGetValue(key, out var last))
                tries.Add(key, last = new TryItem());

            last.TryCount++;

            if (last.TryCount >= MaxTryCount)
                last.Locked = DateTime.UtcNow;

            return last.Locked.HasValue ? Status.Locked : Status.NotLocked;
        }

        private static bool IsLocked(Dictionary<string, TryItem> tries, string? key)
        {
            if (string.IsNullOrEmpty(key))
                return false;

            if (!tries.TryGetValue(key, out var last))
                return false;

            if (last.Locked == null)
                return false;

            if (last.Locked.Value.AddMinutes(LockTimeInMinutes) >= DateTime.UtcNow)
                return true;

            tries.Remove(key);

            return false;
        }
    }
}
