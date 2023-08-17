import { MonthlyCategoryModel, MonthlyModel } from "../models/monthlyModel";
import numberHelper from "../../../utils/numberHelper";

interface Props {
    report: MonthlyModel;
}

export default function MonthlyCategories({ report }: Props) {
    const formatCurrency = numberHelper.formatCurrency;

    let totalMonthCAD = 0;
    let totalPlanCAD = 0;
    let totalNeedCAD = 0;
    let totalWeekCAD = 0;

    for (const category of report.categories) {
        totalMonthCAD += category.monthCAD;
        totalPlanCAD += category.planCAD;
        totalNeedCAD += category.needCAD;
        totalWeekCAD += category.weekCAD;
    }

    const totalDiffCAD = report.summaries.reduce((a, b) => a + b.currentCAD - b.beginningCAD, 0);

    function getPaymentUrl(item: MonthlyCategoryModel) {
        const text = encodeURIComponent(`year:${report.selectedYear} month:${report.selectedMonth} category:"${item.categoryName}"`);
        return `/payments/?type=expenses&text=${text}`;
    }

    return (
        <>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th className="text-end">Month</th>
                        <th className="text-end">Plan</th>
                        <th className="text-end">Need</th>
                        {report.showWeekly && (
                            <th className="text-end">Week</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {report.categories.map(item => (
                        <tr key={item.categoryName}>
                            <td>
                                <a target="_blank" rel="noreferrer" href={getPaymentUrl(item)}>{item.categoryName}</a>
                            </td>
                            <td className="text-end">
                                {formatCurrency(item.monthCAD, report.valueFormatCAD, "zero")}
                            </td>
                            <td className="text-end">
                                {formatCurrency(item.planCAD, report.valueFormatCAD, "zero")}
                            </td>
                            <td className="text-end">
                                {formatCurrency(item.needCAD, report.valueFormatCAD, "zeroAndNegative")}
                            </td>
                            {report.showWeekly && (
                                <td className={`text-end${item.weekCAD === 0 ? " zero" : ""}`}>
                                    {formatCurrency(item.weekCAD, report.valueFormatCAD)}
                                </td>
                            )}
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2} className="text-end">
                            <strong>{formatCurrency(totalMonthCAD, report.valueFormatCAD)}</strong>
                        </td>
                        <td className="text-end">
                            <strong>{formatCurrency(totalPlanCAD, report.valueFormatCAD)}</strong>
                        </td>
                        <td className="text-end">
                            <strong>{formatCurrency(totalNeedCAD, report.valueFormatCAD, "zeroAndNegative")}</strong>
                        </td>
                        {report.showWeekly && (
                            <td className="text-end">
                                <strong>{formatCurrency(totalWeekCAD, report.valueFormatCAD)}</strong>
                            </td>
                        )}
                    </tr>
                </tbody>
            </table>

            <div className="text-end">
                <strong>
                    Expected Balance Change:
                    &nbsp;
                    {formatCurrency(totalDiffCAD, report.valueFormatCAD, "positiveAndNegative")}
                    &nbsp;-&nbsp;
                    {formatCurrency(totalNeedCAD, report.valueFormatCAD)}
                    &nbsp;=&nbsp;
                    {formatCurrency(totalDiffCAD + totalNeedCAD, report.valueFormatCAD, "positiveAndNegative")}
                </strong>
            </div>
        </>
    );
}