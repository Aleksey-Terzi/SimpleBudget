import AmountField from "./AmountField";

interface Props {
    total: number;
    tax: number;
    format: string;
    deductTaxes: boolean;
}

export default function TotalField({ total, tax, format, deductTaxes }: Props) {
    return deductTaxes ? (
        <strong>
            <AmountField amount={total} format={format} highlight="income and expenses" />
            &nbsp;-&nbsp;
            <AmountField amount={tax} format={format} />
            &nbsp;=&nbsp;
            <AmountField amount={total - tax} format={format} highlight="income and expenses" />
        </strong>
    ) : (
        <strong>
            <AmountField amount={total} format={format} highlight="income and expenses" />
        </strong>
    );
}