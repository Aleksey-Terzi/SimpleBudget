using System.Web;

namespace SimpleBudget.Web.Models.Payments
{
    public class IndexModel
    {
        public class FilterClass
        {
            public string? FilterText { get; set; }
            public string? FilterType { get; set; }

            public string? FilterTextEncoded => HttpUtility.UrlEncode(FilterText);
            public string FilterParams
            {
                get
                {
                    var parameters = "";

                    if (!string.IsNullOrEmpty(FilterType))
                        parameters += $"&type={FilterType}";

                    if (!string.IsNullOrEmpty(FilterText))
                        parameters += $"&text={HttpUtility.UrlEncode(FilterText)}";

                    return parameters;
                }
            }
        }

        public class Item
        {
            public int PaymentId { get; set; }
            public DateTime PaymentDate { get; set; }
            public string? CompanyName { get; set; }
            public string? Description { get; set; }
            public string? CategoryName { get; set; }
            public string? WalletName { get; set; }
            public string? PersonName { get; set; }
            public string? ValueFormat { get; set; }
            public decimal Value { get; set; }
            public bool Taxable { get; set; }
            public int? TaxYear { get; set; }

            public string FormattedPaymentDate => $"{PaymentDate:MMM d, yyyy}";

            public string FormattedValue
            {
                get
                {
                    var text = string.Format(ValueFormat ?? "{0:n2}", Math.Abs(Value));
                    return Value > 0 ? $"<span style='color:green;'>{text}</span>" : text;
                }
            }

            public Item? TransferTo { get; set; }
        }

        public int? PaymentId { get; set; }
        public FilterClass? Filter { get; set; }
        public Item[]? Items { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItemCount { get; set; }
        public int PagesPerSection { get; set; }

        public int PageCount
        {
            get
            {
                var pageCount = TotalItemCount / PageSize;
                if (TotalItemCount % PageSize != 0)
                    pageCount++;

                return pageCount;
            }
        }

        public int StartItem => (Page - 1) * PageSize + 1;

        public int EndItem
        {
            get
            {
                var endItem = Page * PageSize;
                if (endItem > TotalItemCount)
                    endItem = TotalItemCount;

                return endItem;
            }
        }

        public int Section => (Page - 1) / PagesPerSection + 1;

        public int SectionCount
        {
            get
            {
                var sectionCount = PageCount / PagesPerSection;
                if (PageCount % PagesPerSection != 0)
                    sectionCount++;

                return sectionCount;
            }
        }

        public int StartPageInSection => (Section - 1) * PagesPerSection + 1;

        public int EndPageInSection
        {
            get
            {
                var endPageInSection = Section * PagesPerSection;
                if (endPageInSection > PageCount)
                    endPageInSection = PageCount;

                return endPageInSection;
            }
        }
    }
}
