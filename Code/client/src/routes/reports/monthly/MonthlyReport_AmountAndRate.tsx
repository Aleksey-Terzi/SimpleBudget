import AmountField from "@/components/fields/AmountField";
import { numberHelper } from "@/helpers/numberHelper";

interface Props {
    currencyCode: string;
    rate: number;
    amount: number;
    format: string;
    formatCAD: string;
}

export default function AmountAndRate({ currencyCode, rate, amount, format, formatCAD }: Props) {
    return (
        <>
            <AmountField amount={rate * amount} format={formatCAD} highlight="income and expenses" />
            {currencyCode.toLowerCase() !== "cad" && (
                <div className="text-description-text text-xs">
                    {numberHelper.formatServerDecimal(rate, 4)} @ <AmountField amount={amount} format={format} />
                </div>
            )}
        </>
    );
}