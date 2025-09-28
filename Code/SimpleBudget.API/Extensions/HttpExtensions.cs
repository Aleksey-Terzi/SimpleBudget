using System.Text.Json;

using SimpleBudget.API.Models;

namespace SimpleBudget.API
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, PaginationData data)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            response.Headers["Pagination"] = JsonSerializer.Serialize(data, options);

            AddExposedHeader(response, "Pagination");
        }

        private static void AddExposedHeader(HttpResponse response, string header)
        {
            var list = response.Headers.AccessControlExposeHeaders.ToList();
            list.Add(header);

            response.Headers.AccessControlExposeHeaders = list.ToArray();
        }
    }
}
