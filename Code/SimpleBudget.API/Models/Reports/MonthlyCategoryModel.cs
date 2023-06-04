namespace SimpleBudget.API.Models
{
    public class MonthlyCategoryModel
    {
        public string CategoryName { get; set; } = default!;
        public decimal MonthCAD { get; set; }
        public decimal PlanCAD { get; set; }
        public decimal NeedCAD { get; set; }
        public decimal WeekCAD { get; set; }

        public string FormattedMonthCAD { get; set; } = default!;
        public string FormattedPlanCAD { get; set; } = default!;
        public string FormattedNeedCAD { get; set; } = default!;
        public string FormattedWeekCAD { get; set; } = default!;
    }
}
