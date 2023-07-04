import { MonthlyModel } from "../models/monthlyModel";
import numberHelper from "../../../utils/numberHelper";

interface Props {
    report: MonthlyModel;
}

export default function MonthlyWallets({ report }: Props) {
    const formatCurrency = numberHelper.formatCurrency;
    const formatRate = numberHelper.formatRate;
    let totalBeginningCAD = 0;
    let totalCurrentCAD = 0;
    let totalDiffCAD = 0;

    for (const item of report.wallets) {
        totalBeginningCAD += item.beginning * item.beginningRate;
        totalCurrentCAD += item.current * item.currentRate;
        totalDiffCAD += totalCurrentCAD - totalBeginningCAD;
    }

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Wallet</th>
                    <th className="text-end">Beginning</th>
                    <th className="text-end">Current</th>
                    <th className="text-end">Diff</th>
                </tr>
            </thead>
            <tbody>
                {report.wallets.map(item => (
                    <tr key={item.walletName}>
                        <td>{item.walletName}</td>
                        <td className="text-end">
                            {formatCurrency(item.beginning * item.beginningRate, report.valueFormatCAD, "positiveAndNegative")}

                            {item.currencyCode.toLowerCase() !== "cad" && (
                                <div><small>{formatRate(item.beginningRate, 4)} @ {formatCurrency(item.beginning, item.valueFormat)}</small></div>
                            )}
                        </td>
                        <td className="text-end">
                            {formatCurrency(item.current * item.currentRate, report.valueFormatCAD, "positiveAndNegative")}

                            {item.currencyCode.toLowerCase() !== "cad" && (
                                <div><small>{formatRate(item.currentRate, 4)} @ {formatCurrency(item.current, item.valueFormat)}</small></div>
                            )}
                        </td>
                        <td className="text-end">
                            {formatCurrency(item.current * item.currentRate - item.beginning * item.beginningRate, report.valueFormatCAD, "positiveAndNegative")}
                        </td>
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