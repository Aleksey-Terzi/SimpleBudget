using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class Category
    {
        public int CategoryId { get; set; }
        public int AccountId { get; set; }
        public string Name { get; set; } = default!;

        public virtual Account Account { get; set; } = default!;

        public virtual ICollection<Payment> Payments { get; set; } = new HashSet<Payment>();
        public virtual ICollection<PlanPayment> PlanPayments { get; set; } = new HashSet<PlanPayment>();
    }

    public class CategoryConfiguration : EntityTypeConfiguration<Category>
    {
        public CategoryConfiguration()
        {
            ToTable("dbo.Category");
            HasKey(x => x.CategoryId);

            HasRequired(a => a.Account).WithMany(b => b.Categories).HasForeignKey(a => a.AccountId).WillCascadeOnDelete(false);
        }
    }
}
