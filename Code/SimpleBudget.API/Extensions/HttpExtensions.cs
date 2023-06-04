using System.Text.Json;

using SimpleBudget.API.Models;

namespace SimpleBudget.API
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, PaginationData data)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(data, options));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
