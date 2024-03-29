﻿using System.Web;

using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class PlanPaymentSearchService
    {
        private readonly IdentityService _identity;
        private readonly PlanPaymentSearch _planPaymentSearch;

        public PlanPaymentSearchService(IdentityService identity, PlanPaymentSearch planPaymentSearch)
        {
            _identity = identity;
            _planPaymentSearch = planPaymentSearch;
        }

        public async Task<(PlanPaymentGridItemModel[] Items, PaginationData Pagination)> Search(PlanPaymentFilterModel input)
        {
            input.Text = HttpUtility.UrlDecode(input.Text);

            var filter = new PlanPaymentFilter();
            FilterHelper.CreateFilter(_identity.AccountId, input.Type, input.Text, filter, _identity.TimeHelper);

            var itemCount = await _planPaymentSearch.Count(filter);

            var page = await FilterHelper.GetPageAsync(
                input.Id,
                input.Page,
                itemCount,
                async (int id) => await _planPaymentSearch.GetRowNumber(id, filter)
                );

            var items = await GetItemsAsync(filter, page);
            var pagination = FilterHelper.GetPagination(page, itemCount);

            return (items, pagination);
        }

        private async Task<PlanPaymentGridItemModel[]> GetItemsAsync(PlanPaymentFilter filter, int page)
        {
            var skip = (page - 1) * FilterHelper.PageSize;

            var preItems = await _planPaymentSearch.Bind(
                x => new
                {
                    x.PlanPaymentId,
                    x.IsActive,
                    x.PaymentStartDate,
                    x.PaymentEndDate,
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
                    .OrderByDescending(x => x.PaymentStartDate)
                    .ThenByDescending(x => x.PlanPaymentId)
                    .Skip(skip)
                    .Take(FilterHelper.PageSize)
            );

            var now = _identity.TimeHelper.GetLocalTime();

            return preItems.Select(x => new PlanPaymentGridItemModel
            {
                PlanPaymentId = x.PlanPaymentId,
                PaymentStartDate = DateHelper.ToClient(x.PaymentStartDate)!,
                PaymentEndDate = DateHelper.ToClient(x.PaymentEndDate),
                CompanyName = x.CompanyName,
                Description = x.Description,
                CategoryName = x.CategoryName,
                WalletName = x.WalletName,
                PersonName = x.PersonName,
                ValueFormat = x.ValueFormat ?? "{0:n2}",
                Value = x.Value,
                Taxable = x.Taxable,
                TaxYear = x.TaxYear,
                IsActive = x.IsActive,
                IsActiveAndInDate = x.IsActive && (x.PaymentEndDate == null || x.PaymentEndDate.Value >= new DateTime(now.Year, now.Month, 1))
            }).ToArray();
        }

        public async Task<PlanPaymentEditItemModel?> GetPlanPayment(int id)
        {
            var planPayment = await _planPaymentSearch.SelectFirst(
                x => x.PlanPaymentId == id && x.Wallet.AccountId == _identity.AccountId,
                x => x.Company, x => x.Category, x => x.Wallet, x => x.Person
            );

            if (planPayment == null)
                return null;

            var paymentType = planPayment.Value > 0 ? "Income" : "Expenses";

            var model = new PlanPaymentEditItemModel
            {
                PaymentType = paymentType,
                IsActive = planPayment.IsActive,
                StartDate = DateHelper.ToClient(planPayment.PaymentStartDate)!,
                EndDate = DateHelper.ToClient(planPayment.PaymentEndDate),
                Company = planPayment.Company?.Name,
                Category = planPayment.Category?.Name,
                Wallet = planPayment.Wallet.Name,
                Description = planPayment.Description,
                Value = planPayment.Value,
                Taxable = planPayment.Taxable,
                TaxYear = planPayment.TaxYear,
                Person = planPayment.Person?.Name
            };

            return model;
        }
    }
}
