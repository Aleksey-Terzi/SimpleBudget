using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class Product
    {
        public int ProductId { get; set; }
        public int AccountId { get; set; }
        public int? CategoryId { get; set; }
        public string Name { get; set; } = default!;

        public Account Account { get; set; } = default!;
        public Category? Category { get; set; }

        public ICollection<ProductPrice> ProductPrices { get; set; } = new HashSet<ProductPrice>();
    }

    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Product", "dbo");
            builder.HasKey(x => x.ProductId);

            builder.HasOne(a => a.Account)
                .WithMany(b => b.Products)
                .HasForeignKey(a => a.AccountId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Category)
                .WithMany(b => b.Products)
                .HasForeignKey(a => a.CategoryId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
