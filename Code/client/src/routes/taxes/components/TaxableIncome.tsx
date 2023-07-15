import dateHelper from "../../../utils/dateHelper";
import numberHelper from "../../../utils/numberHelper";
import { TaxModel } from "../models/taxModel";

interface Props {
    model: TaxModel;
}

export default function TaxableIncome({ model }: Props) {
    const formatCurrency = numberHelper.formatCurrency;
    const formatRate = numberHelper.formatRate;

    const incomeTotalCAD = model.incomes.length > 0
        ? model.incomes.reduce((a, b) => a + b.value * b.rate, 0)
        : 0;

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Wallet</th>
                    <th className="text-end">Value</th>
                </tr>
            </thead>
            <tbody>
                {model.incomes.map(item => (
                    <tr key={item.paymentId}>
                        <td>
                            {dateHelper.formatDate(item.paymentDate)}
                            <small className="ms-1">#{item.paymentId}</small>
                        </td>
                        <td>
                            {item.description}
                            {(item.companyName || item.categoryName) && (
                                <div>
                                    <small>
                                        {item.companyName || ""}
                                        {item.companyName && item.categoryName ? "/" : ""}
                                        {item.categoryName || ""}
                                    </small>
                                </div>
                            )}
                        </td>
                        <td>
                            {item.walletName}
                        </td>
                        <td className="text-end">
                            {formatCurrency(item.value * item.rate, model.valueFormatCAD)}
                            {item.currencyCode.toLowerCase() !== "cad" && (
                                <div><small>{formatRate(item.rate, 4)} @ {formatCurrency(item.value, item.valueFormat)}</small></div>
                            )}
                        </td>
                    </tr>
                ))}
                <tr>
                    <td colSpan={4} className="text-end"><strong>{formatCurrency(incomeTotalCAD, model.valueFormatCAD)}</strong></td>
                </tr>
            </tbody>
        </table>
    );
}