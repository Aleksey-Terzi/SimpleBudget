using System.Globalization;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.Data;
using SimpleBudget.Web.Models.Payments;

namespace SimpleBudget.Web.Controllers
{
    [Authorize]
    public class PaymentsController : BaseController
    {
        private const int PageSize = 15;
        private const int PagesPerSection = 10;

        #region Remove

        public IActionResult Remove(int id, string type, string text)
        {
            ViewData["menu"] = WebConstants.MenuActions.Payments;

            var payment = Searches.Payment.SelectFirst(x => x.PaymentId == id, x => x.Company, x => x.Category, x => x.Wallet.Currency, x => x.Children.Select(y => y.Wallet.Currency));
            if (payment == null)
                return RedirectToAction("Index");

            var child = payment.Children.FirstOrDefault();
            var paymentType = child != null ? "Transfer" : (payment.Value > 0 ? "Income" : "Expenses");

            var model = new RemoveModel
            {
                Id = id,
                Type = type,
                Text = text,
                PaymentType = paymentType,
                Date = string.Format(CultureInfo.InvariantCulture, "{0:MM/dd/yyyy}", payment.PaymentDate),
                Company = payment.Company?.Name,
                Category = payment.Category?.Name,
                Wallet = payment.Wallet.Name,
                Description = payment.Description,
                Value = string.Format(payment.Wallet.Currency.ValueFormat, Math.Abs(payment.Value)),
                WalletTo = child?.Wallet?.Name,
                ValueTo = child != null ? string.Format(child.Wallet.Currency.ValueFormat, Math.Abs(child.Value)) : null
            };

            return View(model);
        }

        [HttpPost]
        public IActionResult Remove(RemoveModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Payments;

            var payment = Searches.Payment.SelectFirst(x => x.PaymentId == model.Id);
            var child = Searches.Payment.SelectFirst(x => x.ParentPaymentId == model.Id);

            var filter = new PaymentFilter();
            FilterHelper.CreateFilter(AccountId, model.Type, model.Text, filter);

            var page = GetPage(model.Id, null, filter, -1);

            if (child != null)
                Stores.Payment.Delete(child);

            if (payment != null)
                Stores.Payment.Delete(payment);

            var url = $"/payments?page={page}&type={model.Type}&text={model.TextEncoded}";

            return Redirect(url);
        }

        #endregion

        #region Add/edit

        public IActionResult Add(int? page, string type, string text)
        {
            ViewData["menu"] = WebConstants.MenuActions.Payments;

            var paymentType = type == "transfer" ? "Transfer" : (type == "income" ? "Income" : "Expenses");

            var model = new EditModel
            {
                Page = page,
                Type = type,
                Text = text,
                PaymentType = paymentType,
                Date = string.Format(CultureInfo.InvariantCulture, "{0:MM/dd/yyyy}", DateTime.Now),
                Category = paymentType == "Transfer" ? "Transfer" : null,
                Taxable = true,
                TaxYear = DateTime.Now.Year
            };

            LoadSelectors(model);

            return View("Edit", model);
        }

        [HttpPost]
        public IActionResult Add(EditModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Payments;

            var wallet = Searches.Wallet.SelectFirst(x => x.AccountId == AccountId && x.Name == model.Wallet);

            if (wallet == null)
                throw new ArgumentNullException("Wallet");

            var category = model.PaymentType == "Transfer" ? "Transfer" : model.Category;

            var payment = new Payment
            {
                CreatedOn = DateTime.UtcNow,
                CreatedByUserId = UserId,
                PaymentDate = DateTime.ParseExact(model.Date, @"M\/d\/yyyy", CultureInfo.InvariantCulture),
                CompanyId = GetOrCreateCompanyId(model.Company),
                CategoryId = GetOrCreateCategoryId(category),
                WalletId = wallet.WalletId,
                Description = model.Description,
                Value = decimal.Parse(model.Value),
                ModifiedOn = DateTime.UtcNow,
                ModifiedByUserId = UserId
            };

            payment.PersonId = !string.IsNullOrEmpty(model.Person)
                ? Searches.Person.SelectFirst(x => x.Name == model.Person && x.AccountId == AccountId)?.PersonId
                : null;

            if (model.PaymentType == "Expenses" || model.PaymentType == "Transfer")
                payment.Value = -payment.Value;
            else
                payment.Taxable = model.Taxable;

            payment.TaxYear = model.PaymentType == "Expenses" && string.Equals(model.Category, Constants.Category.Taxes, StringComparison.OrdinalIgnoreCase)
                ? model.TaxYear
                : null;

            Stores.Payment.Insert(payment);

            if (model.PaymentType == "Transfer")
                UpdateTransfer(payment, null, model);

            var url = $"/payments?id={payment.PaymentId}&type={model.Type}&text={model.TextEncoded}";

            return Redirect(url);
        }

        public IActionResult Edit(int id, string type, string text)
        {
            ViewData["menu"] = WebConstants.MenuActions.Payments;

            var payment = Searches.Payment.SelectFirst(
                x => x.PaymentId == id && x.Wallet.AccountId == AccountId,
                x => x.Company, x => x.Category, x => x.Wallet, x => x.Person, x => x.Children.Select(y => y.Wallet)
            );

            if (payment == null)
                return RedirectToAction("Index");

            var child = payment.Children.FirstOrDefault();
            var paymentType = child != null ? "Transfer" : (payment.Value > 0 ? "Income" : "Expenses");

            var model = new EditModel
            {
                Id = id,
                Type = type,
                Text = text,
                PaymentType = paymentType,
                Date = string.Format(CultureInfo.InvariantCulture, "{0:MM/dd/yyyy}", payment.PaymentDate),
                Company = payment.Company?.Name,
                Category = payment.Category?.Name,
                Wallet = payment.Wallet.Name,
                Description = payment.Description,
                Value = $"{Math.Abs(payment.Value):##########0.00##}",
                Taxable = payment.Taxable,
                TaxYear = payment.TaxYear,
                WalletTo = child?.Wallet?.Name,
                ValueTo = child != null ? $"{Math.Abs(child.Value):##########0.00##}" : null,
                Person = payment.Person?.Name
            };

            LoadSelectors(model);

            return View(model);
        }

        [HttpPost]
        public IActionResult Edit(EditModel model)
        {
            ViewData["menu"] = WebConstants.MenuActions.Payments;

            var category = model.PaymentType == "Transfer" ? "Transfer" : model.Category;

            var wallet = Searches.Wallet.SelectFirst(x => x.AccountId == AccountId && x.Name == model.Wallet);
            if (wallet == null)
                throw new ArgumentException($"Wallet is not found: {model.Wallet}");

            var payment = Searches.Payment.SelectFirst(x => x.PaymentId == model.Id && x.Wallet.AccountId == AccountId);
            if (payment == null)
                throw new ArgumentException($"Payment is not found: {model.Id}");

            payment.PaymentDate = DateTime.ParseExact(model.Date, @"M\/d\/yyyy", CultureInfo.InvariantCulture);
            payment.CompanyId = GetOrCreateCompanyId(model.Company);
            payment.CategoryId = GetOrCreateCategoryId(category);
            payment.WalletId = wallet.WalletId;
            payment.Description = model.Description;
            payment.Value = decimal.Parse(model.Value);

            payment.PersonId = !string.IsNullOrEmpty(model.Person)
                ? Searches.Person.SelectFirst(x => x.Name == model.Person && x.AccountId == AccountId)?.PersonId
                : null;

            if (model.PaymentType == "Expenses" || model.PaymentType == "Transfer")
                payment.Value = -payment.Value;
            else
                payment.Taxable = model.Taxable;

            payment.TaxYear = model.PaymentType == "Expenses" && string.Equals(model.Category, Constants.Category.Taxes, StringComparison.OrdinalIgnoreCase)
                ? model.TaxYear
                : null;

            payment.ModifiedOn = DateTime.UtcNow;
            payment.ModifiedByUserId = UserId;

            Stores.Payment.Update(payment);

            var child = Searches.Payment.SelectFirst(x => x.ParentPaymentId == model.Id);

            if (model.PaymentType == "Transfer")
                UpdateTransfer(payment, child, model);
            else if (child != null)
                Stores.Payment.Delete(child);

            var url = $"/payments?id={model.Id}&type={model.Type}&text={model.TextEncoded}";

            return Redirect(url);
        }

        private void UpdateTransfer(Payment payment, Payment? child, EditModel model)
        {
            if (child == null)
            {
                child = new Payment
                {
                    CreatedOn = DateTime.UtcNow,
                    CreatedByUserId = UserId,
                    ParentPaymentId = payment.PaymentId
                };
            }

            var wallet = Searches.Wallet.SelectFirst(x => x.AccountId == AccountId && x.Name == model.WalletTo);
            if (wallet == null)
                throw new ArgumentException($"Wallet is not found: {model.WalletTo}");

            if (string.IsNullOrEmpty(model.ValueTo))
                throw new ArgumentNullException($"ValueTo");

            child.PaymentDate = payment.PaymentDate;
            child.CompanyId = payment.CompanyId;
            child.CategoryId = payment.CategoryId;
            child.WalletId = wallet.WalletId;
            child.Description = payment.Description;
            child.Value = decimal.Parse(model.ValueTo);
            child.ModifiedOn = DateTime.UtcNow;
            child.ModifiedByUserId = UserId;

            if (child.PaymentId == 0)
                Stores.Payment.Insert(child);
            else
                Stores.Payment.Update(child);
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
            ViewData["menu"] = WebConstants.MenuActions.Payments;

            var filter = new PaymentFilter();
            FilterHelper.CreateFilter(AccountId, type, text, filter);

            var itemCount = Searches.Payment.Count(filter);

            page = GetPage(id, page, filter, itemCount);

            var items = GetItems(filter, page.Value);

            var model = new IndexModel
            {
                PaymentId = id,
                Filter = new IndexModel.FilterClass { FilterType = type?.ToLower(), FilterText = text },
                Items = items,
                Page = page.Value,
                PageSize = PageSize,
                TotalItemCount = itemCount,
                PagesPerSection = PagesPerSection
            };

            return View(model);
        }

        private static IndexModel.Item[] GetItems(PaymentFilter filter, int page)
        {
            var skip = (page - 1) * PageSize;

            var preItems = Searches.Payment.Bind(
                x => new
                {
                    PaymentId = x.PaymentId,
                    PaymentDate = x.PaymentDate,
                    CompanyName = x.Company.Name,
                    Description = x.Description,
                    CategoryName = x.Category.Name,
                    WalletName = x.Wallet.Name,
                    PersonName = x.Person.Name,
                    ValueFormat = x.Wallet.Currency.ValueFormat,
                    Value = x.Value,
                    Taxable = x.Taxable,
                    TaxYear = x.TaxYear,
                    TransferTo = x.Children.Select(y => new
                    {
                        PaymentId = y.PaymentId,
                        WalletName = y.Wallet.Name,
                        ValueFormat = y.Wallet.Currency.ValueFormat,
                        Value = y.Value
                    }).FirstOrDefault()
                },
                filter,
                q => q
                    .OrderByDescending(x => x.PaymentDate)
                    .ThenByDescending(x => x.PaymentId)
                    .Skip(skip)
                    .Take(PageSize)
            );

            return preItems.Select(x => new IndexModel.Item
            {
                PaymentId = x.PaymentId,
                PaymentDate = x.PaymentDate,
                CompanyName = x.CompanyName,
                Description = x.Description,
                CategoryName = x.CategoryName,
                WalletName = x.WalletName,
                PersonName = x.PersonName,
                ValueFormat = x.ValueFormat,
                Value = x.Value,
                Taxable = x.Taxable,
                TaxYear = x.TaxYear,
                TransferTo = x.TransferTo != null
                    ? new IndexModel.Item
                    {
                        PaymentId = x.TransferTo.PaymentId,
                        WalletName = x.TransferTo.WalletName,
                        ValueFormat = x.TransferTo.ValueFormat,
                        Value = x.TransferTo.Value
                    }
                    : null

            }).ToArray();
        }

        private static int GetPage(int? id, int? page, PaymentFilter filter, int itemCount)
        {
            if (page == null)
            {
                if (id == null)
                {
                    page = 1;
                }
                else
                {
                    var rowNumber = Searches.Payment.GetRowNumber(id.Value, filter);

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
