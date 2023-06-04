import { MonthlyCategoryModel, MonthlyModel } from "../models/monthlyModel";
import reportFormatHelper from "../../../utils/reportFormatHelper";

interface Props {
    report: MonthlyModel;
}

export default function MonthlyCategories({ report }: Props) {
    const formatValue = reportFormatHelper.formatValue;

    const totalNeedCAD = report.categories.length > 0
        ? report.categories.reduce((a, b) => a + b.needCAD, 0)
        : 0;

    function getPaymentUrl(item: MonthlyCategoryModel) {
        const text = encodeURIComponent(`year:${report.selectedYear} month:${report.selectedMonth} category:"${item.categoryName}"`);
        return `/payments/?type=expenses&text=${text}`;
    }

    return (
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
                        <td className={`text-end${item.monthCAD === 0 ? " zero": ""}`}>
                            {item.formattedMonthCAD}
                        </td>
                        <td className={`text-end${item.planCAD === 0 ? " zero" : ""}`}>
                            {item.formattedPlanCAD}
                        </td>
                        <td className={`text-end${item.needCAD === 0 ? " zero" : ""}`}>
                            {formatValue(item.needCAD, item.formattedNeedCAD)}
                        </td>
                        {report.showWeekly && (
                            <td className={`text-end${item.weekCAD === 0 ? " zero" : ""}`}>
                                {item.formattedWeekCAD}
                            </td>
                        )}
                    </tr>
                ))}
                <tr>
                    <td colSpan={2} className="text-end">
                        <strong>{report.formattedTotalCategoryMonthCAD}</strong>
                    </td>
                    <td className="text-end">
                        <strong>{report.formattedTotalCategoryPlanCAD}</strong>
                    </td>
                    <td className="text-end">
                        <strong>{formatValue(totalNeedCAD, report.formattedTotalCategoryNeedCAD)}</strong>
                    </td>
                    {report.showWeekly && (
                        <td className="text-end">
                            <strong>{report.formattedTotalCategoryWeekCAD}</strong>
                        </td>
                    )}
                </tr>
            </tbody>
        </table>
    );
}