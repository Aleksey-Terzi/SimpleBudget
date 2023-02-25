using System.Globalization;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.Data;
using SimpleBudget.Web.Models.PlanPayments;

namespace SimpleBudget.Web.Controllers
{
    [Authorize]
    public class PlanPaymentsController : BaseController
    {
        private const int PageSize = 15;
        private const int PagesPerSection = 10;

        #region Remove

        public IActionResult Remove(int id, string type, string text)
        {
            ViewData["menu"] = WebConstants.MenuActions.Plans;

            var planPayment = Searches.PlanPayment.SelectFirst(x => x.PlanPaymentId == id, x => x.Company, x => x.Category, x => x.Wallet.Currency);
            if (planPayment == null)
                return RedirectToAction("Index");

            var paymentType = planPayment.Value > 0 ? "Income" : "Expenses";

            var model = new RemoveModel
            {
                Id = id,
                Type = type,
                Text = text,
                IsActive = planPayment.IsActive,
                PaymentType = paymentType,
                StartDate = planPayment.PaymentStartDate,
                EndDate = planPayment.PaymentEndDate,
                Company = planPayment.Company?.Name,
                Category = planPayment.Category?.Name,
                Wallet = planPayment.Wallet.Name,
                Description = planPayment.Description,
                Value = string.Format(planPayment.Wallet.Currency.ValueFormat, Math.Abs(planPayment.Value))
            };

            return View(model);
        }

        [HttpPost]
        public IActionResult Remove(RemoveModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Plans;

            var planPayment = Searches.PlanPayment.SelectFirst(x => x.PlanPaymentId == model.Id);

            if (planPayment == null)
                return Redirect("/planpayments");

            var filter = new PlanPaymentFilter();
            FilterHelper.CreateFilter(AccountId, model.Type, model.Text, filter);

            var page = GetPage(model.Id, null, filter, -1);

            Stores.PlanPayment.Delete(planPayment);

            var url = $"/planpayments?page={page}&type={model.Type}&text={model.TextEncoded}";

            return Redirect(url);
        }

        #endregion

        #region Add/edit

        public IActionResult Add(int? page, string type, string text)
        {
            ViewData["menu"] = WebConstants.MenuActions.Plans;

            var paymentType = type == "income" ? "Income" : "Expenses";
            var now = TimeHelper.GetLocalTime();

            var model = new EditModel
            {
                Page = page,
                Type = type,
                Text = text,
                IsActive = true,
                PaymentType = paymentType,
                StartDate = string.Format(CultureInfo.InvariantCulture, "{0:MM/dd/yyyy}", now),
                EndDate = string.Format(CultureInfo.InvariantCulture, "{0:MM/dd/yyyy}", now),
                Category = null,
                Taxable = true,
                TaxYear = now.Year
            };

            LoadSelectors(model);

            return View("Edit", model);
        }

        [HttpPost]
        public IActionResult Add(EditModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Plans;

            var wallet = Searches.Wallet.SelectFirst(x => x.AccountId == AccountId && x.Name == model.Wallet);

            if (wallet == null)
                throw new ArgumentException($"The wallet '{model.Wallet}' is not found");

            var planPayment = new PlanPayment
            {
                CreatedOn = DateTime.UtcNow,
                CreatedByUserId = UserId,
                IsActive = model.IsActive,
                PaymentStartDate = DateTime.ParseExact(model.StartDate, @"MM\/dd\/yyyy", CultureInfo.InvariantCulture),
                PaymentEndDate = !string.IsNullOrEmpty(model.EndDate) ? DateTime.ParseExact(model.EndDate, @"MM\/dd\/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null,
                CompanyId = GetOrCreateCompanyId(model.Company),
                CategoryId = GetOrCreateCategoryId(model.Category),
                WalletId = wallet.WalletId,
                Description = model.Description,
                Value = decimal.Parse(model.Value),
                ModifiedOn = DateTime.UtcNow,
                ModifiedByUserId = UserId
            };

            planPayment.PersonId = !string.IsNullOrEmpty(model.Person)
                ? Searches.Person.SelectFirst(x => x.Name == model.Person && x.AccountId == AccountId)?.PersonId
                : null;

            if (model.PaymentType == "Expenses")
                planPayment.Value = -planPayment.Value;
            else
                planPayment.Taxable = model.Taxable;

            planPayment.TaxYear = model.PaymentType == "Expenses" && string.Equals(model.Category, Constants.Category.Taxes, StringComparison.OrdinalIgnoreCase)
                ? model.TaxYear
                : null;

            Stores.PlanPayment.Insert(planPayment);

            var url = $"/planpayments?id={planPayment.PlanPaymentId}&type={model.Type}&text={model.TextEncoded}";

            return Redirect(url);
        }

        public IActionResult Edit(int id, string type, string text)
        {
            ViewData["menu"] = WebConstants.MenuActions.Plans;

            var planPayment = Searches.PlanPayment.SelectFirst(
                x => x.PlanPaymentId == id && x.Wallet.AccountId == AccountId,
                x => x.Company, x => x.Category, x => x.Wallet, x => x.Person
            );

            if (planPayment == null)
                return RedirectToAction("Index");

            var paymentType = planPayment.Value > 0 ? "Income" : "Expenses";

            var model = new EditModel
            {
                Id = id,
                Type = type,
                Text = text,
                IsActive = planPayment.IsActive,
                PaymentType = paymentType,
                StartDate = string.Format(CultureInfo.InvariantCulture, "{0:MM/dd/yyyy}", planPayment.PaymentStartDate),
                EndDate = planPayment.PaymentEndDate.HasValue ? string.Format(CultureInfo.InvariantCulture, "{0:MM/dd/yyyy}", planPayment.PaymentEndDate) : null,
                Company = planPayment.Company?.Name,
                Category = planPayment.Category?.Name,
                Wallet = planPayment.Wallet.Name,
                Description = planPayment.Description,
                Value = $"{Math.Abs(planPayment.Value):##########0.00##}",
                Taxable = planPayment.Taxable,
                TaxYear = planPayment.TaxYear,
                Person = planPayment.Person?.Name
            };

            LoadSelectors(model);

            return View(model);
        }

        [HttpPost]
        public IActionResult Edit(EditModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Plans;

            var category = model.PaymentType == "Transfer" ? "Transfer" : model.Category;

            var planPayment = Searches.PlanPayment.SelectFirst(x => x.PlanPaymentId == model.Id && x.Wallet.AccountId == AccountId);

            if (planPayment == null)
                return Redirect("/planpayments");

            var wallet = Searches.Wallet.SelectFirst(x => x.AccountId == AccountId && x.Name == model.Wallet);

            if (wallet == null)
                throw new ArgumentException($"The wallet '{model.Wallet}' is not found");

            planPayment.IsActive = model.IsActive;
            planPayment.PaymentStartDate = DateTime.ParseExact(model.StartDate, @"MM\/dd\/yyyy", CultureInfo.InvariantCulture);
            planPayment.PaymentEndDate = !string.IsNullOrEmpty(model.EndDate) ? DateTime.ParseExact(model.EndDate, @"MM\/dd\/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            planPayment.CompanyId = GetOrCreateCompanyId(model.Company);
            planPayment.CategoryId = GetOrCreateCategoryId(category);
            planPayment.WalletId = wallet.WalletId;
            planPayment.Description = model.Description;
            planPayment.Value = decimal.Parse(model.Value);

            planPayment.PersonId = !string.IsNullOrEmpty(model.Person)
                ? Searches.Person.SelectFirst(x => x.Name == model.Person && x.AccountId == AccountId)?.PersonId
                : null;

            if (model.PaymentType == "Expenses" || model.PaymentType == "Transfer")
                planPayment.Value = -planPayment.Value;
            else
                planPayment.Taxable = model.Taxable;

            planPayment.TaxYear = model.PaymentType == "Expenses" && string.Equals(model.Category, Constants.Category.Taxes, StringComparison.OrdinalIgnoreCase)
                ? model.TaxYear
                : null;

            planPayment.ModifiedOn = DateTime.UtcNow;
            planPayment.ModifiedByUserId = UserId;

            Stores.PlanPayment.Update(planPayment);

            var url = $"/planpayments?id={model.Id}&type={model.Type}&text={model.TextEncoded}";

            return Redirect(url);
        }

        private void LoadSelectors(EditModel model)
        {
            model.Companies = Searches.Company
                .Bind(x => x.Name, x => x.AccountId == AccountId)
                .Distinct()
                .OrderBy(x => x)
                .ToList();

            model.Categories = Searches.Category
                .Bind(x => x.Name, x => x.AccountId == AccountId)
                .Distinct()
                .OrderBy(x => x)
                .ToList();

            model.Wallets = Searches.Wallet
                .Bind(x => x.Name, x => x.AccountId == AccountId)
                .OrderBy(x => x)
                .ToList();

            model.Persons = Searches.Person
                .Bind(x => x.Name, x => x.AccountId == AccountId)
                .OrderBy(x => x)
                .ToList();
        }

        private int? GetOrCreateCompanyId(string? name)
        {
            if (string.IsNullOrEmpty(name))
                return null;

            var company = Searches.Company.SelectFirst(x => x.AccountId == AccountId && x.Name == name);
            if (company == null)
            {
                company = new Company
                {
                    AccountId = AccountId,
                    Name = name
                };

                Stores.Company.Insert(company);
            }

            return company.CompanyId;
        }

        private int? GetOrCreateCategoryId(string? name)
        {
            if (string.IsNullOrEmpty(name))
                return null;

            var company = Searches.Category.SelectFirst(x => x.AccountId == AccountId && x.Name == name);
            if (company == null)
            {
                company = new Category
                {
                    AccountId = AccountId,
                    Name = name
                };

                Stores.Category.Insert(company);
            }

            return company.CategoryId;
        }

        #endregion

        #region Index

        public IActionResult Index(int? id, int? page, string type, string text)
        {
            ViewData["menu"] = WebConstants.MenuActions.Plans;

            var filter = new PlanPaymentFilter();
            FilterHelper.CreateFilter(AccountId, type, text, filter);

            var itemCount = Searches.PlanPayment.Count(filter);

            page = GetPage(id, page, filter, itemCount);

            var items = GetItems(filter, page.Value);

            var model = new IndexModel
            {
                PlanPaymentId = id,
                Filter = new IndexModel.FilterClass { FilterType = type?.ToLower(), FilterText = text },
                Items = items,
                Page = page.Value,
                PageSize = PageSize,
                TotalItemCount = itemCount,
                PagesPerSection = PagesPerSection
            };

            return View(model);
        }

        private static IndexModel.Item[] GetItems(PlanPaymentFilter filter, int page)
        {
            var skip = (page - 1) * PageSize;

            var preItems = Searches.PlanPayment.Bind(
                x => new
                {
                    PlanPaymentId = x.PlanPaymentId,
                    IsActive = x.IsActive,
                    PaymentStartDate = x.PaymentStartDate,
                    PaymentEndDate = x.PaymentEndDate,
                    CompanyName = x.Company.Name,
                    Description = x.Description,
                    CategoryName = x.Category.Name,
                    WalletName = x.Wallet.Name,
                    PersonName = x.Person.Name,
                    ValueFormat = x.Wallet.Currency.ValueFormat,
                    Value = x.Value,
                    Taxable = x.Taxable,
                    TaxYear = x.TaxYear,
                },
                filter,
                q => q
                    .OrderByDescending(x => x.PaymentStartDate)
                    .ThenByDescending(x => x.PlanPaymentId)
                    .Skip(skip)
                    .Take(PageSize)
            );

            return preItems.Select(x => new IndexModel.Item
            {
                PlanPaymentId = x.PlanPaymentId,
                IsActive = x.IsActive,
                PaymentStartDate = x.PaymentStartDate,
                PaymentEndDate = x.PaymentEndDate,
                CompanyName = x.CompanyName,
                Description = x.Description,
                CategoryName = x.CategoryName,
                WalletName = x.WalletName,
                PersonName = x.PersonName,
                ValueFormat = x.ValueFormat,
                Value = x.Value,
                Taxable = x.Taxable,
                TaxYear = x.TaxYear
            }).ToArray();
        }

        private static int GetPage(int? id, int? page, PlanPaymentFilter filter, int itemCount)
        {
            if (page == null)
            {
                if (id == null)
                {
                    page = 1;
                }
                else
                {
                    var rowNumber = Searches.PlanPayment.GetRowNumber(id.Value, filter);

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

            return page.Value;
        }

        #endregion
    }
}