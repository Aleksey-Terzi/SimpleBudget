using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int WalletId { get; set; }
        public int? CategoryId { get; set; }
        public int? CompanyId { get; set; }
        public int? PersonId { get; set; }
        public int? ParentPaymentId { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal Value { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedByUserId { get; set; }
        public DateTime ModifiedOn { get; set; }
        public int ModifiedByUserId { get; set; }
        public bool Taxable { get; set; }
        public int? TaxYear { get; set; }

        public virtual ICollection<Payment> Children { get; set; } = new HashSet<Payment>();

        public virtual Wallet Wallet { get; set; } = default!;
        public virtual Category Category { get; set; } = default!;
        public virtual Company Company { get; set; } = default!;
        public virtual Person Person { get; set; } = default!;
        public virtual User CreatedByUser { get; set; } = default!;
        public virtual User ModifiedByUser { get; set; } = default!;
        public virtual Payment Parent { get; set; } = default!;
    }

    public class PaymentConfiguration : EntityTypeConfiguration<Payment>
    {
        public PaymentConfiguration()
        {
            ToTable("dbo.Payment");
            HasKey(x => x.PaymentId);

            HasRequired(a => a.Wallet).WithMany(b => b.Payments).HasForeignKey(a => a.WalletId).WillCascadeOnDelete(false);
            HasRequired(a => a.CreatedByUser).WithMany(b => b.CreatedPayments).HasForeignKey(a => a.CreatedByUserId).WillCascadeOnDelete(false);
            HasRequired(a => a.ModifiedByUser).WithMany(b => b.ModifiedPayments).HasForeignKey(a => a.ModifiedByUserId).WillCascadeOnDelete(false);
            HasOptional(a => a.Category).WithMany(b => b.Payments).HasForeignKey(a => a.CategoryId).WillCascadeOnDelete(false);
            HasOptional(a => a.Company).WithMany(b => b.Payments).HasForeignKey(a => a.CompanyId).WillCascadeOnDelete(false);
            HasOptional(a => a.Person).WithMany(b => b.Payments).HasForeignKey(a => a.PersonId).WillCascadeOnDelete(false);
            HasOptional(a => a.Parent).WithMany(b => b.Children).HasForeignKey(a => a.ParentPaymentId).WillCascadeOnDelete(false);
        }
    }
}
