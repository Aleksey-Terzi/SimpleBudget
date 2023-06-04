using System.Web;

using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class PaymentSearchService
    {
        private readonly PaymentSearch _paymentSearch;
        private readonly WalletSearch _walletSearch;

        public PaymentSearchService(
            PaymentSearch paymentSearch,
            WalletSearch walletSearch
            )
        {
            _paymentSearch = paymentSearch;
            _walletSearch = walletSearch;
        }

        public async Task<(PaymentGridItemModel[] Items, PaginationData Pagination)> Search(int accountId, PaymentFilterModel input)
        {
            input.Text = HttpUtility.UrlDecode(input.Text);

            var filter = new PaymentFilter();
            FilterHelper.CreateFilter(accountId, input.Type, input.Text, filter);

            var itemCount = await _paymentSearch.Count(filter);

            var page = await FilterHelper.GetPageAsync(
                input.Id,
                input.Page,
                itemCount,
                async (int id) => await _paymentSearch.GetRowNumber(id, filter)
                );

            var items = await GetItemsAsync(filter, page);
            var pagination = FilterHelper.GetPagination(page, itemCount);

            return (items, pagination);
        }

        private async Task<PaymentGridItemModel[]> GetItemsAsync(PaymentFilter filter, int page)
        {
            var skip = (page - 1) * FilterHelper.PageSize;

            var preItems = await _paymentSearch.Bind(
                x => new
                {
                    x.PaymentId,
                    x.PaymentDate,
                    CompanyName = x.Company.Name,
                    x.Description,
                    CategoryName = x.Category.Name,
                    WalletName = x.Wallet.Name,
                    PersonName = x.Person.Name,
                    x.Wallet.Currency.ValueFormat,
                    x.Value,
                    x.Taxable,
                    x.TaxYear
                },
                filter,
                q => q
                    .OrderByDescending(x => x.PaymentDate)
                    .ThenByDescending(x => x.PaymentId)
                    .Skip(skip)
                    .Take(FilterHelper.PageSize)
            );

            var childPayments = preItems.Count > 0
                ? await GetChildPayments(preItems.Select(x => x.PaymentId).ToList())
                : null;

            return preItems.Select(x => new PaymentGridItemModel
            {
                PaymentId = x.PaymentId,
                FormattedPaymentDate = DateHelper.Format(x.PaymentDate)!,
                CompanyName = x.CompanyName,
                Description = x.Description,
                CategoryName = x.CategoryName,
                WalletName = x.WalletName,
                PersonName = x.PersonName,
                FormattedValue = string.Format(x.ValueFormat ?? "{0:n2}", Math.Abs(x.Value)),
                Value = x.Value,
                Taxable = x.Taxable,
                TaxYear = x.TaxYear,
                TransferTo = childPayments!.TryGetValue(x.PaymentId, out var child) ? child: null

            }).ToArray();
        }

        private async Task<Dictionary<int, PaymentGridItemModel>> GetChildPayments(List<int> parents)
        {
            var preItems = await _paymentSearch.Bind(
                x => new
                {
                    ParentPaymentId = x.ParentPaymentId!.Value,
                    x.PaymentId,
                    WalletName = x.Wallet.Name,
                    x.Wallet.Currency.ValueFormat,
                    x.Value
                },
                x => parents.Contains(x.ParentPaymentId!.Value)
            );

            var result = new Dictionary<int, PaymentGridItemModel>();

            foreach (var preItem in preItems)
            {
                result.Add(preItem.ParentPaymentId, new PaymentGridItemModel
                {
                    PaymentId = preItem.PaymentId,
                    WalletName = preItem.WalletName,
                    FormattedValue = string.Format(preItem.ValueFormat ?? "{0:n2}", Math.Abs(preItem.Value)),
                    Value = preItem.Value
                });
            }

            return result;
        }

        public async Task<PaymentEditItemModel?> GetPayment(int accountId, int id)
        {
            var payment = await _paymentSearch.SelectFirst(
                x => x.PaymentId == id && x.Wallet.AccountId == accountId,
                x => x.Company, x => x.Category, x => x.Wallet, x => x.Person, x => x.Children
            );

            if (payment == null)
                return null;

            var child = payment.Children.FirstOrDefault();
            var childWallet = child != null ? await _walletSearch.SelectFirst(x => x.WalletId == child.WalletId) : null;
            var paymentType = child != null ? "Transfer" : (payment.Value > 0 ? "Income" : "Expenses");

            var model = new PaymentEditItemModel
            {
                PaymentType = paymentType,
                Date = DateHelper.ToClient(payment.PaymentDate)!,
                Company = payment.Company?.Name,
                Category = payment.Category?.Name,
                Wallet = payment.Wallet.Name,
                Description = payment.Description,
                Value = payment.Value,
                Taxable = payment.Taxable,
                TaxYear = payment.TaxYear,
                WalletTo = childWallet?.Name,
                ValueTo = child?.Value,
                Person = payment.Person?.Name
            };

            return model;
        }
    }
}
