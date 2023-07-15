using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class ReportsController : BaseApiController
    {
        private readonly IdentityService _identity;
        private readonly SummaryReportService _summaryReportService;
        private readonly MonthlyReportService _monthlyReportService;

        public ReportsController(
            IdentityService identity,
            SummaryReportService summaryReportService,
            MonthlyReportService monthlyReportService
            )
        {
            _identity = identity;
            _summaryReportService = summaryReportService;
            _monthlyReportService = monthlyReportService;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<SummaryModel>> GetSummary()
        {
            return await _summaryReportService.CreateAsync();
        }

        [HttpGet("monthly")]
        public async Task<ActionResult<MonthlyModel>> GetMonthly(string? year, string? month)
        {
            var now = _identity.TimeHelper.GetLocalTime();

            if (!int.TryParse(year, out var yearInt) || yearInt < 2010 || yearInt > 2050)
                yearInt = now.Year;

            if (!int.TryParse(month, out var monthInt) || monthInt < 1 || monthInt > 12)
                monthInt = now.Month;

            return await _monthlyReportService.CreateAsync(yearInt, monthInt);
        }
    }
}
