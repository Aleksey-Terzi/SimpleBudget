using SimpleBudget.Data;

using SimpleBudget.API.Models;

namespace SimpleBudget.API
{
    static class FilterHelper
    {
        public const int PageSize = 15;
        public const int PagesPerSection = 10;

        public static PaginationData GetPagination(int page, int totalItems)
        {
            var totalPages = totalItems / PageSize;
            if (totalItems % PageSize != 0)
                totalPages++;

            return new PaginationData
            {
                Page = page,
                PageSize = PageSize,
                TotalItems = totalItems,
                TotalPages = totalPages,
                PagesPerSection = PagesPerSection
            };
        }

        public static async Task<int> GetPageAsync(int? id, int? page, int itemCount, Func<int, Task<int>> getRowNumber)
        {
            if (page == null)
            {
                if (id == null)
                {
                    page = 1;
                }
                else
                {
                    var rowNumber = await getRowNumber(id.Value);

                    page = rowNumber > 0 ? (rowNumber - 1) / PageSize + 1 : 1;
                }
            }
            else if (page.Value < 1)
            {
                page = 1;
            }
            else
            {
                var pageCount = itemCount / PageSize;
                if (itemCount % PageSize != 0)
                    pageCount++;

                if (page.Value > pageCount)
                    page = pageCount;
            }

            return page.Value > 0 ? page.Value : 1;
        }

        public static void CreateFilter(int accountId, string? type, string? text, IPaymentFilter filter, TimeHelper timeHelper)
        {
            filter.AccountId = accountId;
            filter.Type = type;

            ParseText(text, filter, timeHelper);
        }

        private static void ParseText(string? text, IPaymentFilter filter, TimeHelper timeHelper)
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

                        SetFilterItem(token, value, filter, timeHelper);
                    }
                }
            }
        }

        private static void SetFilterItem(string? name, string? value, IPaymentFilter filter, TimeHelper timeHelper)
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
            else if (string.Equals(name, "status", StringComparison.OrdinalIgnoreCase) && filter is PlanPaymentFilter planFilter)
            {
                var isActive = string.Equals(value, "active", StringComparison.OrdinalIgnoreCase);
                var now = timeHelper.GetLocalTime();

                if (isActive)
                    planFilter.ActiveAtNow = now;
                else
                    planFilter.InactiveAtNow = now;
            }
            else
            {
                filter.SearchText = value;
            }
        }
    }
}
