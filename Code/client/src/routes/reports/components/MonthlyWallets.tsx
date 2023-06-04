import { MonthlyModel } from "../models/monthlyModel";
import reportFormatHelper from "../../../utils/reportFormatHelper";

interface Props {
    report: MonthlyModel;
}

export default function MonthlyWallets({ report }: Props) {
    const formatValue = reportFormatHelper.formatValue;

    let totalBeginningCAD = 0;
    let totalCurrentCAD = 0;
    let totalDiffCAD = 0;

    for (const item of report.wallets) {
        totalBeginningCAD += item.beginningCAD;
        totalCurrentCAD += item.currentCAD;
        totalDiffCAD += item.diffCAD;
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
                            {formatValue(item.beginningCAD, item.formattedBeginningCAD)}

                            {item.currencyCode.toLowerCase() !== "cad" && (
                                <div><small>{item.formattedBeginningRate} @ {item.formattedBeginning}</small></div>
                            )}
                        </td>
                        <td className="text-end">
                            {formatValue(item.currentCAD, item.formattedCurrentCAD)}

                            {item.currencyCode.toLowerCase() !== "cad" && (
                                <div><small>{item.formattedCurrentRate} @ {item.formattedCurrent}</small></div>
                            )}
                        </td>
                        <td className="text-end">
                            {formatValue(item.diffCAD, item.formattedDiffCAD)}
                        </td>
                    </tr>
                ))}
                <tr>
                    <td></td>
                    <td className="text-end"><strong>{formatValue(totalBeginningCAD, report.formattedTotalWalletBeginningCAD)}</strong></td>
                    <td className="text-end"><strong>{formatValue(totalCurrentCAD, report.formattedTotalWalletCurrentCAD)}</strong></td>
                    <td className="text-end"><strong>{formatValue(totalDiffCAD, report.formattedTotalWalletDiffCAD)}</strong></td>
                </tr>
            </tbody>
        </table>
    );
}