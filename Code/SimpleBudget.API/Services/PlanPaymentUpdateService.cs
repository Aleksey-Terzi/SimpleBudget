using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class PlanPaymentUpdateService
    {
        private readonly IdentityService _identity;
        private readonly CategoryService _categoryService;
        private readonly CompanyService _companyService;
        private readonly PlanPaymentSearch _planPaymentSearch;
        private readonly PlanPaymentStore _planPaymentStore;
        private readonly WalletSearch _walletSearch;
        private readonly PersonSearch _personSearch;

        public PlanPaymentUpdateService(
            IdentityService identity,
            CategoryService categoryService,
            CompanyService companyService,
            PlanPaymentSearch planPaymentSearch,
            PlanPaymentStore planPaymentStore,
            WalletSearch walletSearch,
            PersonSearch personSearch
            )
        {
            _identity = identity;
            _categoryService = categoryService;
            _companyService = companyService;
            _planPaymentSearch = planPaymentSearch;
            _planPaymentStore = planPaymentStore;
            _walletSearch = walletSearch;
            _personSearch = personSearch;
        }

        public async Task DeletePlanPayment(int planPaymentId)
        {
            var planPayment = await _planPaymentSearch.SelectFirst(x => x.Wallet.AccountId == _identity.AccountId && x.PlanPaymentId == planPaymentId);
            if (planPayment == null)
                throw new ArgumentException($"PlanPayment is not found: {planPaymentId}");

            await _planPaymentStore.Delete(planPayment);
        }

        public async Task UpdatePlanPayment(int planPaymentId, PlanPaymentEditItemModel model)
        {
            var planPayment = await _planPaymentSearch.SelectFirst(x => x.PlanPaymentId == planPaymentId && x.Wallet.AccountId == _identity.AccountId);
            if (planPayment == null)
                throw new ArgumentException($"PlanPayment is not found: {planPaymentId}");

            await MapModel(model, planPayment);

            await _planPaymentStore.Update(planPayment);
        }

        public async Task<int> CreatePlanPayment(PlanPaymentEditItemModel model)
        {
            var planPayment = new PlanPayment
            {
                CreatedOn = DateTime.UtcNow,
                CreatedByUserId = _identity.UserId,
            };

            await MapModel(model, planPayment);

            await _planPaymentStore.Insert(planPayment);

            return planPayment.PlanPaymentId;
        }

        private async Task MapModel(PlanPaymentEditItemModel model, PlanPayment entity)
        {
            var wallet = await _walletSearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.Name == model.Wallet);
            if (wallet == null)
                throw new ArgumentException($"Wallet is not found: {model.Wallet}");

            entity.IsActive = model.IsActive;
            entity.PaymentStartDate = DateHelper.ToServer(model.StartDate)!.Value;
            entity.PaymentEndDate = DateHelper.ToServer(model.EndDate);
            entity.CompanyId = await _companyService.GetOrCreateCompanyId(_identity.AccountId, model.Company);
            entity.CategoryId = await _categoryService.GetOrCreateCategoryId(_identity.AccountId, model.Category);
            entity.WalletId = wallet.WalletId;
            entity.Description = !string.IsNullOrEmpty(model.Description) ? model.Description : null;
            entity.Value = model.Value;
            entity.ModifiedOn = DateTime.UtcNow;
            entity.ModifiedByUserId = _identity.UserId;

            entity.PersonId = !string.IsNullOrEmpty(model.Person)
                ? (await _personSearch.SelectFirst(x => x.Name == model.Person && x.AccountId == _identity.AccountId))?.PersonId
                : null;

            if (model.PaymentType == "Expenses")
                entity.Value = -entity.Value;
            else
                entity.Taxable = model.Taxable;

            entity.TaxYear = model.PaymentType == "Expenses" && string.Equals(model.Category, Constants.Category.Taxes, StringComparison.OrdinalIgnoreCase)
                ? model.TaxYear
                : null;
        }
    }
}
