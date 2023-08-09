using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class ImportPaymentUpdateService
    {
        private readonly IdentityService _identity;
        private readonly ImportPaymentStore _importPayementStore;
        private readonly PaymentStore _paymentStore;
        private readonly CategoryService _categoryService;
        private readonly CompanyService _companyService;
        private readonly WalletSearch _walletSearch;

        private readonly Dictionary<string, int> _wallets;
        private readonly Dictionary<string, int?> _categories;
        private readonly Dictionary<string, int?> _companies;

        public ImportPaymentUpdateService(
            IdentityService identity,
            CategoryService categoryService,
            CompanyService companyService,
            WalletSearch walletSearch,
            ImportPaymentStore importPayementStore,
            PaymentStore paymentStore
            )
        {
            _identity = identity;
            _categoryService = categoryService;
            _companyService = companyService;
            _walletSearch = walletSearch;
            _importPayementStore = importPayementStore;
            _paymentStore = paymentStore;

            _wallets = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            _categories = new Dictionary<string, int?>(StringComparer.OrdinalIgnoreCase);
            _companies = new Dictionary<string, int?>(StringComparer.OrdinalIgnoreCase);
        }

        public async Task<List<int>> SavePayments(NewImportModel model)
        {
            if (model.Payments.Count == 0)
                return new List<int>();

            var payments = new List<Payment>();
            var importPayments = new List<ImportPayment>();

            foreach (var paymentModel in model.Payments)
            {
                var payment = await CreatePayment(model.Wallet, paymentModel);
                payments.Add(payment);

                if (!importPayments.Any(x => string.Equals(x.ImportPaymentCode, paymentModel.Code, StringComparison.OrdinalIgnoreCase)))
                {
                    var importPayment = CreateImportPayment(paymentModel.Code, payment);
                    importPayments.Add(importPayment);
                }
            }

            await _paymentStore.InsertMany(payments);
            await _importPayementStore.Upsert(importPayments);

            return payments.Select(x => x.PaymentId).ToList();
        }

        private async Task<Payment> CreatePayment(string wallet, NewImportPaymentModel model)
        {
            var payment = new Payment
            {
                CreatedOn = DateTime.UtcNow,
                CreatedByUserId = _identity.UserId,
                ModifiedOn = DateTime.UtcNow,
                ModifiedByUserId = _identity.UserId,
                PaymentDate = DateHelper.ToServer(model.Date)!.Value,
                Description = !string.IsNullOrEmpty(model.Description) ? model.Description : null,
                Value = -model.Value
            };

            await GetWallet(wallet, payment);
            await GetCategory(model.Category, payment);
            await GetCompany(model.Company, payment);

            return payment;
        }

        private ImportPayment CreateImportPayment(string code, Payment payment)
        {
            return new ImportPayment
            {
                ImportPaymentCode = code,
                AccountId = _identity.AccountId,
                CategoryId = payment.CategoryId,
                CompanyId = payment.CompanyId,
                CreatedByUserId = _identity.UserId,
                CreatedOn = DateTime.UtcNow,
                ModifiedByUserId = _identity.UserId,
                ModifiedOn = DateTime.UtcNow
            };
        }

        private async Task GetWallet(string walletName, Payment payment)
        {
            if (_wallets.TryGetValue(walletName, out var walletId))
            {
                payment.WalletId = walletId;
                return;
            }

            var wallet = await _walletSearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.Name == walletName);
            if (wallet == null)
                throw new ArgumentException($"Wallet is not found: {walletName}");

            _wallets.Add(walletName, wallet.WalletId);

            payment.WalletId = wallet.WalletId;
        }

        private async Task GetCategory(string? categoryName, Payment payment)
        {
            if (string.IsNullOrEmpty(categoryName))
                return;

            if (!_categories.TryGetValue(categoryName, out var categoryId))
            {
                categoryId = await _categoryService.GetOrCreateCategoryId(_identity.AccountId, categoryName);
                _categories.Add(categoryName, categoryId);
            }

            payment.CategoryId = categoryId;
        }

        private async Task GetCompany(string? companyName, Payment payment)
        {
            if (string.IsNullOrEmpty(companyName))
                return;

            if (!_companies.TryGetValue(companyName, out var companyId))
            {
                companyId = await _companyService.GetOrCreateCompanyId(_identity.AccountId, companyName);
                _companies.Add(companyName, companyId);
            }

            payment.CompanyId = companyId;
        }
    }
}
