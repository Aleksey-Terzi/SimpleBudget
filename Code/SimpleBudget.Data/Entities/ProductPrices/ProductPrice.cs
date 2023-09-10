using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleBudget.Data
{
    public class ProductPrice
    {
        public int ProductPriceId { get; set; }
        public int ProductId { get; set; }
        public int? PaymentId { get; set; }
        public int? CompanyId { get; set; }
        public int? CategoryId { get; set; }
        public DateTime PriceDate { get; set; }
        public decimal Price { get; set; }
        public bool IsDiscount { get; set; }
        public int? Quantity { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedByUserId { get; set; }
        public DateTime ModifiedOn { get; set; }
        public int ModifiedByUserId { get; set; }

        public Product Product { get; set; } = default!;
        public Company? Company { get; set; }
        public Category? Category { get; set; }
    }

    public class ProductPriceConfiguration : IEntityTypeConfiguration<ProductPrice>
    {
        public void Configure(EntityTypeBuilder<ProductPrice> builder)
        {
            builder.ToTable("ProductPrice", "dbo");
            builder.HasKey(x => x.ProductPriceId);

            builder.HasOne(a => a.Product)
                .WithMany(b => b.ProductPrices)
                .HasForeignKey(a => a.ProductId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(a => a.Company)
                .WithMany(b => b.ProductPrices)
                .HasForeignKey(a => a.CompanyId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);
            
            builder.HasOne(a => a.Category)
                .WithMany(b => b.ProductPrices)
                .HasForeignKey(a => a.CategoryId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
