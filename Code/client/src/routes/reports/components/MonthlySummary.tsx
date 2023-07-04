import { MonthlyModel } from "../models/monthlyModel";
import numberHelper from "../../../utils/numberHelper";

interface Props {
    report: MonthlyModel;
}

export default function MonthlySummary({ report }: Props) {
    const formatCurrency = numberHelper.formatCurrency;
    let totalBeginningCAD = 0;
    let totalCurrentCAD = 0;
    let totalDiffCAD = 0;

    for (const item of report.summaries) {
        totalBeginningCAD += item.beginningCAD;
        totalCurrentCAD += item.currentCAD;
        totalDiffCAD += item.currentCAD - item.beginningCAD;
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
                        <td className="text-end">{formatCurrency(item.beginningCAD, report.valueFormatCAD, "positiveAndNegative")}</td>
                        <td className="text-end">{formatCurrency(item.currentCAD, report.valueFormatCAD, "positiveAndNegative")}</td>
                        <td className="text-end">{formatCurrency(item.currentCAD - item.beginningCAD, report.valueFormatCAD, "positiveAndNegative")}</td>
                    </tr>
                ))}
                <tr>
                    <td></td>
                    <td className="text-end"><strong>{formatCurrency(totalBeginningCAD, report.valueFormatCAD, "positiveAndNegative")}</strong></td>
                    <td className="text-end"><strong>{formatCurrency(totalCurrentCAD, report.valueFormatCAD, "positiveAndNegative")}</strong></td>
                    <td className="text-end"><strong>{formatCurrency(totalDiffCAD, report.valueFormatCAD, "positiveAndNegative")}</strong></td>
                </tr>
            </tbody>
        </table>
    );
}