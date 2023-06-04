using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class Category
    {
        public int CategoryId { get; set; }
        public int AccountId { get; set; }
        public string Name { get; set; } = default!;

        public Account Account { get; set; } = default!;

        public ICollection<Payment> Payments { get; set; } = new HashSet<Payment>();
        public ICollection<PlanPayment> PlanPayments { get; set; } = new HashSet<PlanPayment>();
    }

    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("Category", "dbo");
            builder.HasKey(x => x.CategoryId);

            builder.HasOne(a => a.Account)
                .WithMany(b => b.Categories)
                .HasForeignKey(a => a.AccountId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
