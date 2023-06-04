using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class PaymentUpdateService
    {
        private readonly CategoryService _categoryService;
        private readonly CompanyService _companyService;
        private readonly PaymentSearch _paymentSearch;
        private readonly PaymentStore _paymentStore;
        private readonly WalletSearch _walletSearch;
        private readonly PersonSearch _personSearch;

        public PaymentUpdateService(
            CategoryService categoryService,
            CompanyService companyService,
            PaymentSearch paymentSearch,
            PaymentStore paymentStore,
            WalletSearch walletSearch,
            PersonSearch personSearch
            )
        {
            _categoryService = categoryService;
            _companyService = companyService;
            _paymentSearch = paymentSearch;
            _paymentStore = paymentStore;
            _walletSearch = walletSearch;
            _personSearch = personSearch;
        }

        public async Task DeletePayment(int accountId, int paymentId)
        {
            var payment = await _paymentSearch.SelectFirst(x => x.Wallet.AccountId == accountId && x.PaymentId == paymentId);
            if (payment == null)
                throw new ArgumentException($"Payment is not found: {paymentId}");

            var child = await _paymentSearch.SelectFirst(x => x.ParentPaymentId == paymentId);

            await _paymentStore.Delete(payment);

            if (child != null)
                await _paymentStore.Delete(child);
        }

        public async Task UpdatePayment(int accountId, int userId, int paymentId, PaymentEditItemModel model)
        {
            var payment = await _paymentSearch.SelectFirst(x => x.PaymentId == paymentId && x.Wallet.AccountId == accountId);
            if (payment == null)
                throw new ArgumentException($"Payment is not found: {paymentId}");

            await MapModel(accountId, userId, model, payment);

            await _paymentStore.Update(payment);

            var child = await _paymentSearch.SelectFirst(x => x.ParentPaymentId == paymentId);

            if (model.PaymentType == "Transfer")
                await UpdateTransfer(accountId, userId, payment, child, model);
            else if (child != null)
                await _paymentStore.Delete(child);
        }

        public async Task<int> CreatePayment(int accountId, int userId, PaymentEditItemModel model)
        {
            var payment = new Payment
            {
                CreatedOn = DateTime.UtcNow,
                CreatedByUserId = userId,
            };

            await MapModel(accountId, userId, model, payment);

            await _paymentStore.Insert(payment);

            if (model.PaymentType == "Transfer")
                await UpdateTransfer(accountId, userId, payment, null, model);

            return payment.PaymentId;
        }

        private async Task MapModel(int accountId, int userId, PaymentEditItemModel model, Payment entity)
        {
            var wallet = await _walletSearch.SelectFirst(x => x.AccountId == accountId && x.Name == model.Wallet);
            if (wallet == null)
                throw new ArgumentException($"Wallet is not found: {model.Wallet}");

            var category = model.PaymentType == "Transfer" ? "Transfer" : model.Category;

            entity.PaymentDate = DateHelper.ToServer(model.Date)!.Value;
            entity.CompanyId = await _companyService.GetOrCreateCompanyId(accountId, model.Company);
            entity.CategoryId = await _categoryService.GetOrCreateCategoryId(accountId, category);
            entity.WalletId = wallet.WalletId;
            entity.Description = !string.IsNullOrEmpty(model.Description) ? model.Description : null;
            entity.Value = model.Value;
            entity.ModifiedOn = DateTime.UtcNow;
            entity.ModifiedByUserId = userId;

            entity.PersonId = !string.IsNullOrEmpty(model.Person)
                ? (await _personSearch.SelectFirst(x => x.Name == model.Person && x.AccountId == accountId))?.PersonId
                : null;

            if (model.PaymentType == "Expenses" || model.PaymentType == "Transfer")
                entity.Value = -entity.Value;
            else
                entity.Taxable = model.Taxable;

            entity.TaxYear = model.PaymentType == "Expenses" && string.Equals(model.Category, Constants.Category.Taxes, StringComparison.OrdinalIgnoreCase)
                ? model.TaxYear
                : null;
        }

        private async Task UpdateTransfer(int accountId, int userId, Payment payment, Payment? child, PaymentEditItemModel model)
        {
            if (child == null)
            {
                child = new Payment
                {
                    CreatedOn = DateTime.UtcNow,
                    CreatedByUserId = userId,
                    ParentPaymentId = payment.PaymentId
                };
            }

            var wallet = await _walletSearch.SelectFirst(x => x.AccountId == accountId && x.Name == model.WalletTo);
            if (wallet == null)
                throw new ArgumentException($"Wallet is not found: {model.WalletTo}");

            if (model.ValueTo == null)
                throw new ArgumentNullException($"ValueTo");

            child.PaymentDate = payment.PaymentDate;
            child.CompanyId = payment.CompanyId;
            child.CategoryId = payment.CategoryId;
            child.WalletId = wallet.WalletId;
            child.Description = payment.Description;
            child.Value = model.ValueTo.Value;
            child.ModifiedOn = DateTime.UtcNow;
            child.ModifiedByUserId = userId;

            if (child.PaymentId == 0)
                await _paymentStore.Insert(child);
            else
                await _paymentStore.Update(child);
        }
    }
}
