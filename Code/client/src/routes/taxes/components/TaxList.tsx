import dateHelper from "../../../utils/dateHelper";
import numberHelper from "../../../utils/numberHelper";
import { TaxModel } from "../models/taxModel";

interface Props {
    model: TaxModel;
}

export default function TaxList({ model }: Props) {
    const formatCurrency = numberHelper.formatCurrency;

    const incomeTotalCAD = model.incomes.length > 0
        ? model.incomes.reduce((a, b) => a + b.value * b.rate, 0)
        : 0;

    const taxTotalCAD = model.taxItems.reduce((a, b) => a + b.valueCAD, 0);
    const taxPaidTotalCAD = model.taxItems.reduce((a, b) => a + b.valuePaidCAD, 0);
    const taxDiffTotalCAD = taxPaidTotalCAD - taxTotalCAD;

    return (
        <>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th className="text-end">Value</th>
                        <th className="text-end">Paid</th>
                        <th className="text-end">Diff</th>
                    </tr>
                </thead>
                <tbody>
                    {model.taxItems.map(item => (
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td className="text-end">{formatCurrency(item.valueCAD, model.valueFormatCAD)}</td>
                            <td className="text-end">{formatCurrency(item.valuePaidCAD, model.valueFormatCAD)}</td>
                            <td className="text-end">{formatCurrency(item.valuePaidCAD - item.valueCAD, model.valueFormatCAD, "positiveAndNegative")}</td>
                        </tr>
                    ))}
                    <tr>
                        <td></td>
                        <td className="text-end"><strong>{formatCurrency(taxTotalCAD, model.valueFormatCAD)}</strong></td>
                        <td className="text-end"><strong>{formatCurrency(taxPaidTotalCAD, model.valueFormatCAD)}</strong></td>
                        <td className="text-end"><strong>{formatCurrency(taxDiffTotalCAD, model.valueFormatCAD, "positiveAndNegative")}</strong></td>
                    </tr>
                </tbody>
            </table>

            <div className="text-end">
                Taxable Income: <strong>{formatCurrency(incomeTotalCAD, model.valueFormatCAD)}</strong>
            </div>

            {model.closed && (
                <div className="text-end mt-2">
                    Closed: <b>{dateHelper.formatDate(model.closed)}</b>
                </div>
            )}
        </>
    );
}