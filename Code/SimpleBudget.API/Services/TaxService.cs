using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class TaxService
    {
        private class DeductionItem
        {
            public decimal Rate { get; set; }
            public decimal Exemption { get; set; }
            public decimal MaxContribution { get; set; }
            public decimal Paid { get; set; }
            public decimal Estimated { get; set; }
        }

        private class TaxRateItem
        {
            public decimal Rate { get; set; }
            public decimal MaxAmount { get; set; }
        }

        private class Tax
        {
            public List<TaxRateItem> TaxRates { get; set; } = default!;
            public decimal PersonalAmount { get; set; }
            public decimal Paid { get; set; }
            public decimal Estimated { get; set; }
        }

        private readonly IdentityService _identity;
        private readonly CurrencySearch _currencySearch;
        private readonly PersonSearch _personSearch;
        private readonly PaymentSearch _paymentSearch;
        private readonly TaxRateSearch _taxRateSearch;
        private readonly TaxSettingSearch _taxSettingSearch;
        private readonly TaxYearSearch _taxYearSearch;
        private readonly TaxYearStore _taxYearStore;

        private TaxModel _model = default!;
        private int? _limitMonth;
        private DateTime? _limitTaxPaymentDate;

        private DeductionItem _cpp = default!;
        private DeductionItem _ei = default!;
        private Tax _federalTax = default!;
        private Tax _provinceTax = default!;

        private decimal _income;
        private decimal _estimatedYearIncome;

        public TaxService(
            IdentityService identity,
            CurrencySearch currencySearch,
            PersonSearch personSearch,
            PaymentSearch paymentSearch,
            TaxRateSearch taxRateSearch,
            TaxSettingSearch taxSettingSearch,
            TaxYearSearch taxYearSearch,
            TaxYearStore taxYearStore
            )
        {
            _identity = identity;
            _currencySearch = currencySearch;
            _personSearch = personSearch;
            _paymentSearch = paymentSearch;
            _taxRateSearch = taxRateSearch;
            _taxSettingSearch = taxSettingSearch;
            _taxYearSearch = taxYearSearch;
            _taxYearStore = taxYearStore;
        }

        public async Task<TaxModel> CloseYearAsync(int? personId, int? year)
        {
            await CreateModelAsync(personId, year, null, null);

            if (_model.SelectedPersonId == null)
                return _model;

            var taxYearEntity = await _taxYearSearch.SelectFirst(x => x.PersonId == _model.SelectedPersonId && x.Year == _model.SelectedYear);
            if (taxYearEntity != null)
                return _model;

            var lastTaxPayment = (await _paymentSearch.Select(
                x =>
                    x.PersonId == _model.SelectedPersonId
                    && x.TaxYear == _model.SelectedYear
                    && x.Category.Name == Constants.Category.Taxes,
                q => q.OrderBy(x => x.PaymentDate)
            )).FirstOrDefault();

            var closed = lastTaxPayment != null && lastTaxPayment.PaymentDate.Year > _model.SelectedYear
                ? lastTaxPayment.PaymentDate
                : new DateTime(_model.SelectedYear + 1, 1, 1);

            taxYearEntity = new TaxYear
            {
                Year = _model.SelectedYear,
                PersonId = _model.SelectedPersonId.Value,
                FinalTaxAmount = _model.TaxPaidTotalCAD,
                Closed = closed
            };

            await _taxYearStore.Insert(taxYearEntity);

            _model.FormattedClosed = await GetClosed();

            return _model;
        }

        public async Task<TaxModel> OpenYearAsync(int? personId, int? year)
        {
            await CreateModelAsync(personId, year, null, null);

            if (_model.SelectedPersonId == null)
                return _model;

            var taxYearEntity = await _taxYearSearch.SelectFirst(x => x.PersonId == _model.SelectedPersonId && x.Year == _model.SelectedYear);
            if (taxYearEntity != null)
            {
                await _taxYearStore.Delete(taxYearEntity);

                _model.FormattedClosed = await GetClosed();
            }

            return _model;
        }

        public async Task<TaxModel> CreateModelAsync(int? selectedPersonId, int? selectedYear, int? limitMonth, DateTime? limitTaxPaymentDate)
        {
            var cad = await _currencySearch.SelectFirst(x => x.AccountId == _identity.AccountId && x.Code == "CAD");
            if (cad == null)
                throw new ArgumentException("CAD currency is not found");

            _model = new TaxModel();

            _limitTaxPaymentDate = limitTaxPaymentDate;

            await LoadBasicDataAsync(selectedPersonId, selectedYear, limitMonth);
            await LoadIncomesAsync(cad.ValueFormat);

            _cpp = await LoadDeductionAsync(Constants.Tax.CPP, Constants.Tax.CPPBasicExemptionAmount, Constants.Company.CPP) ?? new DeductionItem();
            _ei = await LoadDeductionAsync(Constants.Tax.EI, null, Constants.Company.EI);
            _federalTax = await LoadIncomeTaxAsync(Constants.Tax.FederalTax, Constants.Tax.FederalBasicPersonalAmount, Constants.Tax.CanadaEmploymentBaseAmount, Constants.Company.FederalTax);
            _provinceTax = await LoadIncomeTaxAsync(Constants.Tax.AlbertaTax, Constants.Tax.AlbertaBasicPersonalAmount, null, Constants.Company.ProvincialTax);

            LoadEstimatedYearIncome();

            CalculateDeduction(_cpp);
            CalculateDeduction(_ei);
            CalculateIncomeTax(_federalTax);
            CalculateIncomeTax(_provinceTax);

            LoadTaxItems(cad.ValueFormat);

            var now = TimeHelper.GetLocalTime();
            _model.CanOpen = _model.SelectedYear == now.Year || _model.SelectedYear == now.Year - 1;

            _model.FormattedClosed = await GetClosed();

            return _model;
        }

        private async Task<string?> GetClosed()
        {
            var closed = (await _taxYearSearch.SelectFirst(x => x.PersonId == _model.SelectedPersonId && x.Year == _model.SelectedYear))?.Closed;
            return closed.HasValue ? $"{closed:MMM d, yyyy}" : null;
        }

        private void LoadTaxItems(string valueFormatCAD)
        {
            _model.TaxItems = new List<TaxItemModel>
            {
                CreateItem("CPP", _cpp.Estimated, _cpp.Paid),
                CreateItem("EI", _ei.Estimated, _ei.Paid),
                CreateItem("Federal Tax", _federalTax.Estimated, _federalTax.Paid),
                CreateItem("Provincial Tax", _provinceTax.Estimated, _provinceTax.Paid),
            };

            _model.TaxTotalCAD = _model.TaxItems.Sum(x => x.ValueCAD);
            _model.TaxPaidTotalCAD = _model.TaxItems.Sum(x => x.ValuePaidCAD);
            _model.TaxDiffTotalCAD = _model.TaxItems.Sum(x => x.DiffCAD);

            _model.FormattedTaxTotalCAD = string.Format(valueFormatCAD, _model.TaxTotalCAD);
            _model.FormattedTaxPaidTotalCAD = string.Format(valueFormatCAD, _model.TaxPaidTotalCAD);
            _model.FormattedTaxDiffTotalCAD = string.Format(valueFormatCAD, Math.Abs(_model.TaxDiffTotalCAD));

            TaxItemModel CreateItem(string name, decimal estimated, decimal paid)
            {
                var diffCAD = paid - estimated;

                return new TaxItemModel
                {
                    Name = name,
                    ValueCAD = estimated,
                    ValuePaidCAD = paid,
                    DiffCAD = diffCAD,
                    FormattedValueCAD = string.Format(valueFormatCAD, estimated),
                    FormattedValuePaidCAD = string.Format(valueFormatCAD, paid),
                    FormattedDiffCAD = string.Format(valueFormatCAD, Math.Abs(diffCAD))
                };
            }
        }

        private void CalculateDeduction(DeductionItem item)
        {
            var value = (_income - item.Exemption) * item.Rate;

            item.Estimated = value > item.MaxContribution ? item.MaxContribution : value;

            if (item.Estimated < 0)
                item.Estimated = 0;
        }

        private void CalculateIncomeTax(Tax tax)
        {
            var taxAmount = 0m;
            var prevMaxAmount = 0m;
            var remained = _estimatedYearIncome;

            foreach (var taxRate in tax.TaxRates)
            {
                var amount = taxRate.MaxAmount - prevMaxAmount;
                if (amount > remained)
                    amount = remained;

                taxAmount += taxRate.Rate * amount;

                remained -= amount;

                if (remained == 0)
                    break;

                prevMaxAmount = taxRate.MaxAmount;
            }

            var amountForTaxCredit = tax.PersonalAmount + _cpp.Estimated + _ei.Estimated;
            var taxCredit = tax.TaxRates[0].Rate * amountForTaxCredit;

            taxAmount -= taxCredit;

            if (taxAmount < 0)
            {
                tax.Estimated = 0;
            }
            else
            {
                var averageTaxRate = taxAmount / _estimatedYearIncome;
                tax.Estimated = _income * averageTaxRate;
            }
        }

        private async Task LoadBasicDataAsync(int? selectedPersonId, int? selectedYear, int? limitMonth)
        {
            _limitMonth = limitMonth;

            var currentYear = TimeHelper.GetLocalTime().Year;

            _model.Years = new List<int>();
            if (currentYear > 2020)
                _model.Years.Add(currentYear - 1);

            _model.Years.Add(currentYear);

            _model.SelectedYear = selectedYear ?? _model.Years[0];

            _model.Persons = (await _personSearch.Bind(
                x => new TaxPersonModel
                {
                    PersonId = x.PersonId,
                    Name = x.Name
                },
                x => x.AccountId == _identity.AccountId,
                q => q.OrderBy(x => x.PersonId)
            )).ToList();

            if (selectedPersonId == null || _model.Persons.Find(x => x.PersonId == selectedPersonId) == null)
            {
                _model.SelectedPersonId = _model.SelectedPersonId == null && _model.Persons.Count > 0
                    ? _model.Persons[0].PersonId
                    : null;
            }
            else
            {
                _model.SelectedPersonId = selectedPersonId;
            }
        }

        private async Task LoadIncomesAsync(string valueFormatCAD)
        {
            if (_model.SelectedPersonId == null)
            {
                _model.Incomes = new List<TaxIncomeModel>();
                return;
            }

            var incomes = await _paymentSearch.Bind(
                x => new
                {
                    PaymentId = x.PaymentId,
                    PaymentDate = x.PaymentDate,
                    CompanyName = x.Company.Name,
                    Description = x.Description,
                    CategoryName = x.Category.Name,
                    WalletName = x.Wallet.Name,
                    CurrencyCode = x.Wallet.Currency.Code,
                    ValueFormat = x.Wallet.Currency.ValueFormat,
                    Value = x.Value,
                    Rate = x.Wallet.Currency.Code != "CAD"
                        ? x.Wallet.Currency.CurrencyRates.Where(y => y.StartDate == x.PaymentDate && y.BankOfCanada).Select(y => (decimal?)y.Rate).FirstOrDefault() ?? 0
                        : 1
                },
                x =>
                    x.Wallet.AccountId == _identity.AccountId
                    && x.PersonId == _model.SelectedPersonId
                    && x.Value > 0
                    && x.PaymentDate.Year == _model.SelectedYear
                    && (_limitMonth == null || x.PaymentDate.Month <= _limitMonth)
                    && x.Taxable,
                q => q.OrderBy(x => x.PaymentDate)
            );

            _model.Incomes = incomes.Select(x => new TaxIncomeModel
            {
                PaymentId = x.PaymentId,
                PaymentDate = x.PaymentDate,
                CompanyName = x.CompanyName,
                Description = x.Description,
                CategoryName = x.CategoryName,
                WalletName = x.WalletName,
                CurrencyCode = x.CurrencyCode,
                ValueCAD = x.Rate * x.Value,
                Rate = x.Rate,
                FormattedPaymentDate = $"{x.PaymentDate:MMM d, yyyy}",
                FormattedValue = string.Format(x.ValueFormat, x.Value),
                FormattedValueCAD = string.Format(valueFormatCAD, x.Rate * x.Value),
                FormattedRate = $"{x.Rate:####0.0000}"
            }).ToList();

            _model.IncomeTotalCAD = _model.Incomes.Count > 0 && !_model.Incomes.Any(x => x.Rate == 0) ? _model.Incomes.Sum(x => x.ValueCAD) : 0;
            _model.FormattedIncomeTotalCAD = string.Format(valueFormatCAD, _model.IncomeTotalCAD);
        }

        private async Task<DeductionItem> LoadDeductionAsync(string name, string? exemptionAmountName, string company)
        {
            var taxRate = (await _taxRateSearch.Select(x => x.AccountId == _identity.AccountId && x.Name == name && x.PeriodYear <= _model.SelectedYear))
                .OrderByDescending(x => x.PeriodYear)
                .FirstOrDefault();

            if (taxRate == null)
                throw new ArgumentException($"TaxRate is not specified for {name}");

            var exemptionAmount = exemptionAmountName != null
                ? (await _taxSettingSearch.Select(x => x.AccountId == _identity.AccountId && x.Name == exemptionAmountName && x.PeriodYear <= _model.SelectedYear))
                    .OrderByDescending(x => x.PeriodYear)
                    .FirstOrDefault()
                : null;

            var paidItems = await _paymentSearch.Select(x =>
                x.PersonId == _model.SelectedPersonId
                && x.Value < 0
                && x.TaxYear == _model.SelectedYear
                && (_limitMonth == null || x.PaymentDate.Year < x.TaxYear || x.PaymentDate.Month <= _limitMonth)
                && (_limitTaxPaymentDate == null || x.PaymentDate <= _limitTaxPaymentDate)
                && x.Company.Name == company
                && x.Category.Name == Constants.Category.Taxes
            );

            return new DeductionItem
            {
                Rate = taxRate.Rate,
                MaxContribution = taxRate.Rate * (taxRate.MaxAmount - (exemptionAmount?.Value ?? 0)),
                Exemption = exemptionAmount?.Value ?? 0,
                Paid = paidItems.Count > 0 ? -paidItems.Sum(x => x.Value) : 0
            };
        }

        private async Task<Tax> LoadIncomeTaxAsync(string taxName, string basicPersonalAmountName, string? employmentBaseAmountName, string company)
        {
            var taxLatestYear = await  _taxRateSearch.SelectLatestYear(_identity.AccountId, taxName, _model.SelectedYear);

            var taxRates = (await _taxRateSearch.Bind(
                x => new TaxRateItem { Rate = x.Rate, MaxAmount = x.MaxAmount },
                x => x.AccountId == _identity.AccountId && x.Name == taxName && x.PeriodYear == taxLatestYear,
                q => q.OrderBy(x => x.MaxAmount)
            )).ToList();

            var basicPersonalAmount = (await _taxSettingSearch.Select(x => x.AccountId == _identity.AccountId && x.Name == basicPersonalAmountName && x.PeriodYear <= _model.SelectedYear))
                .OrderByDescending(x => x.PeriodYear)
                .FirstOrDefault();

            if (basicPersonalAmount == null)
                throw new ArgumentException($"BasicPersonalAmount is not specified for {basicPersonalAmountName}");

            var employmentBaseAmount = employmentBaseAmountName != null
                ? (await _taxSettingSearch.Select(x => x.AccountId == _identity.AccountId && x.Name == employmentBaseAmountName && x.PeriodYear <= _model.SelectedYear))
                    .OrderByDescending(x => x.PeriodYear)
                    .FirstOrDefault()
                : null;

            var paidItems = await _paymentSearch.Select(x =>
                x.PersonId == _model.SelectedPersonId
                && x.Value < 0
                && x.TaxYear == _model.SelectedYear
                && (_limitMonth == null || x.PaymentDate.Year < x.TaxYear || x.PaymentDate.Month <= _limitMonth)
                && (_limitTaxPaymentDate == null || x.PaymentDate <= _limitTaxPaymentDate)
                && x.Company.Name == company
                && x.Category.Name == Constants.Category.Taxes
            );

            return new Tax
            {
                TaxRates = taxRates,
                PersonalAmount = basicPersonalAmount.Value + (employmentBaseAmount?.Value ?? 0),
                Paid = paidItems.Count > 0 ? -paidItems.Sum(x => x.Value) : 0
            };
        }

        private void LoadEstimatedYearIncome()
        {
            _income = _model.IncomeTotalCAD;

            if (_income > 0)
            {
                var now = TimeHelper.GetLocalTime();
                var currentMonth = _limitMonth ?? (_model.SelectedYear == now.Year ? now.Month : 12);
                var incomeMonths = currentMonth;

                if (_model.Incomes.FirstOrDefault(x => x.PaymentDate.Month == currentMonth) == null)
                    incomeMonths--;

                _estimatedYearIncome = 12 * _income / incomeMonths;
            }
            else
            {
                _estimatedYearIncome = _income;
            }
        }
    }
}
