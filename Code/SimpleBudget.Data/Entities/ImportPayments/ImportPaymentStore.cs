using Microsoft.EntityFrameworkCore;

namespace SimpleBudget.Data
{
    public class ImportPaymentStore : StoreHelper<ImportPayment>
    {
        public ImportPaymentStore(BudgetDbContext context) : base(context) { }

        public async Task Upsert(List<ImportPayment> importPayments)
        {
            foreach (var importPayment in importPayments)
            {
                var existing = await Context.ImportPayments
                    .Where(x => x.ImportPaymentCode == importPayment.ImportPaymentCode)
                    .FirstOrDefaultAsync();

                if (existing == null)
                {
                    await Context.ImportPayments.AddAsync(importPayment);
                    await Context.SaveChangesAsync();

                    continue;
                }

                if (existing.CategoryId == importPayment.CategoryId
                    && existing.CompanyId == importPayment.CompanyId
                    )
                {
                    continue;
                }

                existing.CategoryId = importPayment.CategoryId;
                existing.CompanyId = importPayment.CompanyId;
                existing.ModifiedByUserId = importPayment.ModifiedByUserId;
                existing.ModifiedOn = importPayment.ModifiedOn;

                await Context.SaveChangesAsync();
            }
        }
    }
}
