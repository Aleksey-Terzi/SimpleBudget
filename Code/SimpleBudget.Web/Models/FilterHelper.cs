using SimpleBudget.Data;

namespace SimpleBudget.Web
{
    static class FilterHelper
    {
        public static void CreateFilter(int accountId, string? type, string? text, IPaymentFilter filter)
        {
            filter.AccountId = accountId;
            filter.Type = type;

            ParseText(text, filter);
        }

        private static void ParseText(string? text, IPaymentFilter filter)
        {
            if (string.IsNullOrWhiteSpace(text))
                return;

            int index = 0;

            while (index < text.Length)
            {
                var startIndex = index;

                while (index < text.Length && text[index] != ':')
                    index++;

                var token = startIndex != index ? text.Substring(startIndex, index - startIndex).Trim() : "";

                if (index == text.Length)
                {
                    filter.SearchText = token.Trim();
                }
                else
                {
                    index++;

                    while (index < text.Length && text[index] == ' ')
                        index++;

                    string value;

                    if (index < text.Length)
                    {
                        var stopChar = text[index] == '"' ? '"' : ' ';

                        if (stopChar == '"')
                            index++;

                        startIndex = index;

                        while (index < text.Length && text[index] != stopChar)
                            index++;

                        value = text.Substring(startIndex, index - startIndex);

                        if (index < text.Length)
                            index++;

                        SetFilterItem(token, value, filter);
                    }
                }
            }
        }

        private static void SetFilterItem(string? name, string? value, IPaymentFilter filter)
        {
            if (string.Equals(name, "year", StringComparison.OrdinalIgnoreCase))
            {
                if (int.TryParse(value, out var year))
                    filter.PaymentYear = year;
            }
            else if (string.Equals(name, "month", StringComparison.OrdinalIgnoreCase))
            {
                if (int.TryParse(value, out var month))
                    filter.PaymentMonth = month;
            }
            else if (string.Equals(name, "category", StringComparison.OrdinalIgnoreCase))
            {
                filter.Category = value;
            }
            else
            {
                filter.SearchText = value;
            }
        }
    }
}
