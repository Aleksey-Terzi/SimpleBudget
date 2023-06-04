import reportFormatHelper from "../../../utils/reportFormatHelper";
import { TaxModel } from "../models/taxModel";

interface Props {
    model: TaxModel;
}

export default function TaxList({ model }: Props) {
    const formatValue = reportFormatHelper.formatValue;

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
                            <td className="text-end">{item.formattedValueCAD}</td>
                            <td className="text-end">{item.formattedValuePaidCAD}</td>
                            <td className="text-end">{formatValue(item.diffCAD, item.formattedDiffCAD)}</td>
                        </tr>
                    ))}
                    <tr>
                        <td></td>
                        <td className="text-end"><strong>{model.formattedTaxTotalCAD}</strong></td>
                        <td className="text-end"><strong>{model.formattedTaxPaidTotalCAD}</strong></td>
                        <td className="text-end"><strong>{formatValue(model.taxDiffTotalCAD, model.formattedTaxDiffTotalCAD)}</strong></td>
                    </tr>
                </tbody>
            </table>

            <div className="text-end">
                Taxable Income: <strong>{model.formattedIncomeTotalCAD}</strong>
            </div>

            {model.formattedClosed && (
                <div className="text-end mt-2">
                    Closed: <b>{model.formattedClosed}</b>
                </div>
            )}
        </>
    );
}