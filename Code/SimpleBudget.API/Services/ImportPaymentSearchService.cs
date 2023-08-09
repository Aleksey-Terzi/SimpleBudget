using System.Globalization;
using System.Text;

using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class ImportPaymentSearchService
    {
        private class FileItem
        {
            public DateTime Date { get; set; }
            public string Name { get; set; } = default!;
            public string Code { get; set; } = default!;
            public decimal? Credit { get; set; }
            public decimal? Debit { get; set; }
            public decimal? Balance { get; set; }
        }

        private class ImportPaymentItem
        {
            public string Code { get; set; } = default!;
            public string? Category { get; set; }
            public string? Company { get; set; }

            public int? CategoryId { get; set; }
            public int? CompanyId { get; set; }
        }

        private readonly IdentityService _identity;
        private readonly ImportPaymentSearch _importPayementSearch;
        private readonly PaymentSearch _paymentSearch;
        private readonly CurrencySearch _currencySearch;

        public ImportPaymentSearchService(
            IdentityService identity,
            ImportPaymentSearch importPayementSearch,
            PaymentSearch paymentSearch,
            CurrencySearch currencySearch
            )
        {
            _identity = identity;
            _importPayementSearch = importPayementSearch;
            _paymentSearch = paymentSearch;
            _currencySearch = currencySearch;
        }

        public async Task<ImportModel> GetSuggestedPayments(Stream file)
        {
            List<FileItem> fileItems;

            try
            {
                fileItems = await ParseFile(file);
            }
            catch (ArgumentException e)
            {
                return new ImportModel { Error = e.Message };
            }

            var cad = await _currencySearch.SelectDefault(_identity.AccountId);

            if (fileItems.Count == 0)
                return new ImportModel { ValueFormat = cad.ValueFormat, Payments = new List<SuggestedPaymentModel>() };

            var codes = fileItems.Select(x => x.Code).Distinct().ToHashSet();
            var importPayments = await GetImportPayments(codes);

            var start = fileItems.Min(x => x.Date);
            var end = fileItems.Max(x => x.Date);
            var existingPayments = await GetExistingPayments(start, end);

            var suggestedPayments = CreateSuggestedPayments(fileItems, importPayments, existingPayments);

            return new ImportModel { ValueFormat = cad.ValueFormat, Payments = suggestedPayments };
        }

        private List<SuggestedPaymentModel> CreateSuggestedPayments(
            List<FileItem> fileItems,
            List<ImportPaymentItem> importPayments,
            List<Payment> existingPayments
            )
        {
            var result = new List<SuggestedPaymentModel>();

            fileItems.Sort((a, b) =>
            {
                var cmp = -a.Date.CompareTo(b.Date);
                return cmp == 0
                    ? a.Name.CompareTo(b.Name)
                    : cmp;
            });

            foreach (var fileItem in fileItems)
            {
                if (IsFileItemExcldued(fileItem))
                    continue;

                var existing = existingPayments.Find(x =>
                    x.Value == -fileItem.Credit!.Value
                    && x.PaymentDate == fileItem.Date
                );

                if (existing != null)
                {
                    existingPayments.Remove(existing);
                    continue;
                }

                var importPayment = importPayments.Find(y => y.Code == fileItem.Code);

                var model = new SuggestedPaymentModel
                {
                    Code = fileItem.Code,
                    Name = fileItem.Name,
                    Date = DateHelper.ToClient(fileItem.Date)!,
                    Category = importPayment?.Category,
                    Company = importPayment?.Company,
                    Value = fileItem.Credit!.Value
                };

                result.Add(model);
            }

            return result;
        }

        private bool IsFileItemExcldued(FileItem fileItem)
        {
            return fileItem.Credit == null
                    || fileItem.Debit.HasValue
                    || fileItem.Name.EndsWith("TFR-TO C/C", StringComparison.OrdinalIgnoreCase) // Transfers should be enetered manually
                    || fileItem.Name.EndsWith("MONTHLY ACCOUNT FEE", StringComparison.OrdinalIgnoreCase) // Monthly fee should be enetered manually
                    ;
        }

        private async Task<List<ImportPaymentItem>> GetImportPayments(HashSet<string> codes)
        {
            return await _importPayementSearch.Bind(x => new ImportPaymentItem
            {
                Code = x.ImportPaymentCode,
                Category = x.Category!.Name,
                Company = x.Company!.Name,
                CategoryId = x.CategoryId,
                CompanyId = x.CompanyId
            }, x => x.AccountId == _identity.AccountId && codes.Contains(x.ImportPaymentCode));
        }

        private async Task<List<Payment>> GetExistingPayments(DateTime start, DateTime end)
        {
            return await _paymentSearch.Bind(
                x => x,
                x => x.Wallet.AccountId == _identity.AccountId
                        && x.PaymentDate >= start
                        && x.PaymentDate <= end
            );
        }

        private async Task<List<FileItem>> ParseFile(Stream file)
        {
            using var reader = new StreamReader(file, Encoding.UTF8);

            var fileText = await reader.ReadToEndAsync();
            var lines = CsvReader.Read(fileText, 5);
            var result = new List<FileItem>();

            for (int i = 0; i < lines.Length; i++)
            {
                var line = lines[i];
                var lineNumber = i + 1;

                if (!DateTime.TryParse(line[0], CultureInfo.InvariantCulture, out var date))
                    throw new ArgumentException($"The date cannot be parsed at line {lineNumber}");

                var item = new FileItem
                {
                    Date = date,
                    Name = line[1].Trim(),
                    Credit = ParseDecimal(lineNumber, "Credit", line[2]),
                    Debit = ParseDecimal(lineNumber, "Debit", line[3]),
                    Balance = ParseDecimal(lineNumber, "Balance", line[4])
                };

                item.Code = GetCode(item.Name);

                result.Add(item);
            }

            return result;
        }

        private static string GetCode(string name)
        {
            const string paypal = "PAYPAL *";

            if (name.StartsWith(paypal, StringComparison.OrdinalIgnoreCase) && name.Length > paypal.Length)
                return name.Substring(paypal.Length).Trim().ToUpper();

            var startIndex = name.IndexOf('*');

            var result = startIndex >= 0
                ? name.Substring(0, startIndex)
                : name;

            return result.Trim().ToUpper();
        }

        private static decimal? ParseDecimal(int lineNumber, string fieldName, string s)
        {
            if (string.IsNullOrEmpty(s))
                return null;

            if (decimal.TryParse(s, out var d))
                return d;

            throw new ArgumentException($"{fieldName} is not valid number at line {lineNumber}");
        }
    }
}
