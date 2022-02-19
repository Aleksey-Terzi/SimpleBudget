using SimpleBudget.Data;

namespace SimpleBudget.Web.Models.Reports
{
    public class TaxModelHelper
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

        private int _accountId;
        private TaxModel _model = default!;
        private int? _limitMonth;
        private DateTime? _limitTaxPaymentDate;

        private DeductionItem _cpp = default!;
        private DeductionItem _ei = default!;
        private Tax _federalTax = default!;
        private Tax _provinceTax = default!;

        private decimal _income;
        private decimal _estimatedYearIncome;

        private TaxModelHelper() { }

        public static TaxModel CreateModel(int accountId, int? selectedPersonId, int? selectedYear, int? limitMonth, DateTime? limitTaxPaymentDate)
        {
            return new TaxModelHelper().InternalCreateModel(accountId, selectedPersonId, selectedYear, limitMonth, limitTaxPaymentDate);
        }

        private TaxModel InternalCreateModel(int accountId, int? selectedPersonId, int? selectedYear, int? limitMonth, DateTime? limitTaxPaymentDate)
        {
            _accountId = accountId;

            _model = new TaxModel();

            _limitTaxPaymentDate = limitTaxPaymentDate;

            LoadBasicData(selectedPersonId, selectedYear, limitMonth);

            _cpp = LoadDeduction(Constants.Tax.CPP, Constants.Tax.CPPBasicExemptionAmount, Constants.Company.CPP) ?? new DeductionItem();
            _ei = LoadDeduction(Constants.Tax.EI, null, Constants.Company.EI);
            _federalTax = LoadIncomeTax(Constants.Tax.FederalTax, Constants.Tax.FederalBasicPersonalAmount, Constants.Tax.CanadaEmploymentBaseAmount, Constants.Company.FederalTax);
            _provinceTax = LoadIncomeTax(Constants.Tax.AlbertaTax, Constants.Tax.AlbertaBasicPersonalAmount, null, Constants.Company.ProvincialTax);

            LoadIncome();

            CalculateDeduction(_cpp);
            CalculateDeduction(_ei);
            CalculateIncomeTax(_federalTax);
            CalculateIncomeTax(_provinceTax);

            _model.TaxItems = new List<TaxModel.TaxItem>();

            _model.TaxItems.Add(new TaxModel.TaxItem
            {
                Name = "CPP",
                Value = _cpp.Estimated,
                ValuePaid = _cpp.Paid,
                ValueFormat = _model.ValueFormat
            });

            _model.TaxItems.Add(new TaxModel.TaxItem
            {
                Name = "EI",
                Value = _ei.Estimated,
                ValuePaid = _ei.Paid,
                ValueFormat = _model.ValueFormat
            });

            _model.TaxItems.Add(new TaxModel.TaxItem
            {
                Name = "Federal Tax",
                Value = _federalTax.Estimated,
                ValuePaid = _federalTax.Paid,
                ValueFormat = _model.ValueFormat
            });

            _model.TaxItems.Add(new TaxModel.TaxItem
            {
                Name = "Provincial Tax",
                Value = _provinceTax.Estimated,
                ValuePaid = _provinceTax.Paid,
                ValueFormat = _model.ValueFormat
            });

            return _model;
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

        private void LoadBasicData(int? selectedPersonId, int? selectedYear, int? limitMonth)
        {
            _limitMonth = limitMonth;

            var cad = Searches.Currency.SelectFirst(x => x.AccountId == _accountId && x.Code == "CAD");

            if (cad == null)
                throw new ArgumentException("CAD currency is not found");

            _model.ValueFormat = cad.ValueFormat;

            var currentYear = DateTime.Now.Year;

            _model.Years = new List<int>();
            if (currentYear > 2020)
                _model.Years.Add(currentYear - 1);

            _model.Years.Add(currentYear);

            _model.SelectedYear = selectedYear ?? _model.Years[0];

            _model.Persons = Searches.Person.Bind(
                x => new TaxModel.PersonItem
                {
                    PersonId = x.PersonId,
                    Name = x.Name
                },
                x => x.AccountId == _accountId,
                q => q.OrderBy(x => x.PersonId)
            ).ToList();

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

            if (_model.SelectedPersonId.HasValue)
            {
                _model.IncomeItems = Searches.Payment.Bind(
                    x => new TaxModel.IncomeItem
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
                            : 1,
                        ValueFormatCAD = cad.ValueFormat
                    },
                    x =>
                        x.Wallet.AccountId == _accountId
                        && x.PersonId == _model.SelectedPersonId
                        && x.Value > 0
                        && x.PaymentDate.Year == _model.SelectedYear
                        && (_limitMonth == null || x.PaymentDate.Month <= _limitMonth)
                        && x.Taxable,
                    q => q.OrderBy(x => x.PaymentDate)
                ).ToList();
            }
            else
            {
                _model.IncomeItems = new List<TaxModel.IncomeItem>();
            }
        }

        private DeductionItem LoadDeduction(string name, string? exemptionAmountName, string company)
        {
            var taxRate = Searches.Tax
                .Select(x => x.AccountId == _accountId && x.Name == name && x.PeriodYear <= _model.SelectedYear)
                .OrderByDescending(x => x.PeriodYear)
                .FirstOrDefault();

            if (taxRate == null)
                throw new ArgumentException($"TaxRate is not specified for {name}");

            var exemptionAmount = exemptionAmountName != null
                ? Searches.TaxSetting
                    .Select(x => x.AccountId == _accountId && x.Name == exemptionAmountName && x.PeriodYear <= _model.SelectedYear)
                    .OrderByDescending(x => x.PeriodYear)
                    .FirstOrDefault()
                : null;

            var paidItems = Searches.Payment.Select(x =>
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

        private Tax LoadIncomeTax(string taxName, string basicPersonalAmountName, string? employmentBaseAmountName, string company)
        {
            var taxLatestYear = Searches.Tax.SelectLatestYear(_accountId, taxName, _model.SelectedYear);

            var taxRates = Searches.Tax.Bind(
                x => new TaxRateItem { Rate = x.Rate, MaxAmount = x.MaxAmount },
                x => x.AccountId == _accountId && x.Name == taxName && x.PeriodYear == taxLatestYear,
                q => q.OrderBy(x => x.MaxAmount)
            ).ToList();

            var basicPersonalAmount = Searches.TaxSetting
                .Select(x => x.AccountId == _accountId && x.Name == basicPersonalAmountName && x.PeriodYear <= _model.SelectedYear)
                .OrderByDescending(x => x.PeriodYear)
                .FirstOrDefault();

            if (basicPersonalAmount == null)
                throw new ArgumentException($"BasicPersonalAmount is not specified for {basicPersonalAmountName}");

            var employmentBaseAmount = employmentBaseAmountName != null
                ? Searches.TaxSetting
                    .Select(x => x.AccountId == _accountId && x.Name == employmentBaseAmountName && x.PeriodYear <= _model.SelectedYear)
                    .OrderByDescending(x => x.PeriodYear)
                    .FirstOrDefault()
                : null;

            var paidItems = Searches.Payment.Select(x =>
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

        private void LoadIncome()
        {
            _income = _model.IncomeTotalValue;

            if (_income > 0)
            {
                var currentMonth = _limitMonth ?? (_model.SelectedYear == DateTime.Now.Year ? DateTime.Now.Month : 12);
                var incomeMonths = currentMonth;

                if (_model.IncomeItems.FirstOrDefault(x => x.PaymentDate.Month == currentMonth) == null)
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
