using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class CompanyService
    {
        private readonly CompanySearch _companySearch;
        private readonly CompanyStore _companyStore;

        public CompanyService(CompanySearch companySearch, CompanyStore companyStore)
        {
            _companySearch = companySearch;
            _companyStore = companyStore;
        }

        public async Task<int?> GetOrCreateCompanyId(int accountId, string? name)
        {
            if (string.IsNullOrEmpty(name))
                return null;

            var company = await _companySearch.SelectFirst(x => x.AccountId == accountId && x.Name == name);
            if (company == null)
            {
                company = new Company
                {
                    AccountId = accountId,
                    Name = name
                };

                await _companyStore.Insert(company);
            }

            return company.CompanyId;
        }
    }
}
