import { MonthlyModel } from "../models/monthlyModel";
import reportFormatHelper from "../../../utils/reportFormatHelper";

interface Props {
    report: MonthlyModel;
}

export default function MonthlySummary({ report }: Props) {
    const formatValue = reportFormatHelper.formatValue;

    let totalBeginningCAD = 0;
    let totalCurrentCAD = 0;
    let totalDiffCAD = 0;

    for (const item of report.summaries) {
        totalBeginningCAD += item.beginningCAD;
        totalCurrentCAD += item.currentCAD;
        totalDiffCAD += item.diffCAD;
    }

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="text-end">Beginning</th>
                    <th className="text-end">Current</th>
                    <th className="text-end">Diff</th>
                </tr>
            </thead>
            <tbody>
                {report.summaries.map(item => (
                    <tr key={item.name}>
                        <td>{item.name}</td>
                        <td className="text-end">{formatValue(item.beginningCAD, item.formattedBeginningCAD)}</td>
                        <td className="text-end">{formatValue(item.currentCAD, item.formattedCurrentCAD)}</td>
                        <td className="text-end">{formatValue(item.diffCAD, item.formattedDiffCAD)}</td>
                    </tr>
                ))}
                <tr>
                    <td></td>
                    <td className="text-end"><strong>{formatValue(totalBeginningCAD, report.formattedTotalSummaryBeginningCAD)}</strong></td>
                    <td className="text-end"><strong>{formatValue(totalCurrentCAD, report.formattedTotalSummaryCurrentCAD)}</strong></td>
                    <td className="text-end"><strong>{formatValue(totalDiffCAD, report.formattedTotalSummaryDiffCAD)}</strong></td>
                </tr>
            </tbody>
        </table>
    );
}