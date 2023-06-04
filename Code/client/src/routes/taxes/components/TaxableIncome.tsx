import { TaxModel } from "../models/taxModel";

interface Props {
    model: TaxModel;
}

export default function TaxableIncome({ model }: Props) {
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
                            {item.formattedPaymentDate}
                            <small>#{item.paymentId}</small>
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
                            {item.formattedValueCAD}
                            {item.currencyCode.toLowerCase() !== "cad" && (
                                <div><small>{item.formattedRate} @ {item.formattedValue}</small></div>
                            )}
                        </td>
                    </tr>
                ))}
                <tr>
                    <td colSpan={4} className="text-end"><strong>{model.formattedIncomeTotalCAD}</strong></td>
                </tr>
            </tbody>
        </table>
    );
}