using System.Data.Entity.ModelConfiguration;

namespace SimpleBudget.Data
{
    public class PlanPayment
    {
        public int PlanPaymentId { get; set; }
        public int WalletId { get; set; }
        public int? CategoryId { get; set; }
        public int? CompanyId { get; set; }
        public int? PersonId { get; set; }
        public DateTime PaymentStartDate { get; set; }
        public DateTime? PaymentEndDate { get; set; }
        public decimal Value { get; set; }
        public string? Description { get; set; }
        public bool Taxable { get; set; }
        public int? TaxYear { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedByUserId { get; set; }
        public DateTime ModifiedOn { get; set; }
        public int ModifiedByUserId { get; set; }

        public virtual Wallet Wallet { get; set; } = default!;
        public virtual Category Category { get; set; } = default!;
        public virtual Company Company { get; set; } = default!;
        public virtual Person Person { get; set; } = default!;
        public virtual User CreatedByUser { get; set; } = default!;
        public virtual User ModifiedByUser { get; set; } = default!;
    }

    public class PlanPaymentConfiguration : EntityTypeConfiguration<PlanPayment>
    {
        public PlanPaymentConfiguration()
        {
            ToTable("dbo.PlanPayment");
            HasKey(x => x.PlanPaymentId);

            HasRequired(a => a.Wallet).WithMany(b => b.PlanPayments).HasForeignKey(a => a.WalletId).WillCascadeOnDelete(false);
            HasRequired(a => a.CreatedByUser).WithMany(b => b.CreatedPlanPayments).HasForeignKey(a => a.CreatedByUserId).WillCascadeOnDelete(false);
            HasRequired(a => a.ModifiedByUser).WithMany(b => b.ModifiedPlanPayments).HasForeignKey(a => a.ModifiedByUserId).WillCascadeOnDelete(false);
            HasOptional(a => a.Category).WithMany(b => b.PlanPayments).HasForeignKey(a => a.CategoryId).WillCascadeOnDelete(false);
            HasOptional(a => a.Company).WithMany(b => b.PlanPayments).HasForeignKey(a => a.CompanyId).WillCascadeOnDelete(false);
            HasOptional(a => a.Person).WithMany(b => b.PlanPayments).HasForeignKey(a => a.PersonId).WillCascadeOnDelete(false);
        }
    }
}
