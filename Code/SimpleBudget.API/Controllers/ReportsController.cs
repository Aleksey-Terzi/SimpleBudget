using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using SimpleBudget.API.Models;
using SimpleBudget.Data;

namespace SimpleBudget.API.Controllers
{
    [Authorize]
    public class ReportsController : BaseApiController
    {
        private readonly SummaryReportService _summaryReportService;
        private readonly MonthlyReportService _monthlyReportService;

        public ReportsController(
            SummaryReportService summaryReportService,
            MonthlyReportService monthlyReportService
            )
        {
            _summaryReportService = summaryReportService;
            _monthlyReportService = monthlyReportService;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<SummaryModel>> GetSummary()
        {
            return await _summaryReportService.CreateAsync(AccountId);
        }

        [HttpGet("monthly")]
        public async Task<ActionResult<MonthlyModel>> GetMonthly(string? year, string? month)
        {
            var now = TimeHelper.GetLocalTime();

            if (!int.TryParse(year, out var yearInt) || yearInt < 2010 || yearInt > 2050)
                yearInt = now.Year;

            if (!int.TryParse(month, out var monthInt) || monthInt < 1 || monthInt > 12)
                monthInt = now.Month;

            return await _monthlyReportService.CreateAsync(AccountId, yearInt, monthInt);
        }
    }
}
