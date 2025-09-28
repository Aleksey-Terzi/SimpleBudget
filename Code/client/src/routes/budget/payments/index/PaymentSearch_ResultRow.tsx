import EditCol from "@/components/fields/EditCol";
import { PaymentRow } from "./PaymentRow";
import { dateHelper } from "@/helpers/date/dateHelper";
import { apiDateFormatType } from "@/api/restClient";
import Icon from "@/components/Icon";
import AmountField from "@/components/fields/AmountField";
import { numberHelper } from "@/helpers/numberHelper";

export default function PaymentSearch_ResultRow({ baseUrl, p }: { baseUrl: string; p: PaymentRow }) {
    return (
        <tr className={p.isSelected ? "font-semibold" : ""}>
            <EditCol
                editUrl={`${baseUrl}${p.paymentId}`}
                deleteUrl={`${baseUrl}${p.paymentId}/delete`}
            />
            <td className="text-nowrap">
                {dateHelper.format(dateHelper.parse(p.paymentDate, apiDateFormatType), "mmm d, yyyy")}
                <span className="text-description-text text-xs ms-1">
                    {p.transferToPaymentId ? (
                        <>#{p.paymentId} / {p.transferToPaymentId}</>
                    ) : (
                        <>#{p.paymentId}</>
                    )}
                </span>
            </td>
            <td>{p.companyName}</td>
            <td>{p.description}</td>
            <td>
                {p.categoryName}
                {p.taxYear && (
                    <div className="text-description-text text-xs">Tax Year: {p.taxYear}</div>
                )}
            </td>
            <td>
                {p.walletName}
                {p.transferToWalletName && (
                    <div className="text-description-text text-xs">{p.transferToWalletName}</div>
                )}
            </td>
            <td>
                {p.personName}
            </td>
            <td className="text-nowrap text-end">
                <div className="flex justify-between">
                    <div>
                        {p.transferToPaymentId && <Icon icon="reset" title="Transfer" />}
                        {p.taxable && <Icon icon="calculator" className="text-orange-400" title="Taxable" />}
                    </div>
                    <div>
                        <AmountField amount={numberHelper.fromServerDecimal(p.value)} format={p.valueFormat} highlight="income" />
                        {p.transferToValue && p.transferToValueFormat && p.value !== -p.transferToValue && (
                            <div className="text-description-text text-xs">
                                <AmountField amount={numberHelper.fromServerDecimal(p.transferToValue)} format={p.transferToValueFormat} />
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
}