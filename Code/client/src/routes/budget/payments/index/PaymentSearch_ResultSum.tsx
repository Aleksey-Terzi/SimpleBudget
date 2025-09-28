import AmountField from "@/components/fields/AmountField";
import { PaymentRow } from "./PaymentRow";
import { numberHelper } from "@/helpers/numberHelper";

export default function PaymentSearch_ResultSum({ p, colSpan }: { p: PaymentRow, colSpan: number }) {
    return (
        <tr>
            <td className="text-nowrap text-end font-semibold" colSpan={colSpan}>
                <AmountField amount={numberHelper.fromServerDecimal(p.value)} format={p.valueFormat} highlight="income and expenses" />
            </td>
        </tr>
    );
}