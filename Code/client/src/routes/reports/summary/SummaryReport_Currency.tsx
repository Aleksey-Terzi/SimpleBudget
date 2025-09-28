import { SummaryCurrencyModel } from "@/api/models/SummaryCurrencyModel";
import AmountField from "@/components/fields/AmountField";
import TotalField from "@/components/fields/TotalField";
import FormTitle from "@/components/form/FormTitle";
import Grid from "@/components/Grid";
import { numberHelper } from "@/helpers/numberHelper";
import { useMemo } from "react";

interface Props {
    taxCAD: number;
    valueFormatCAD: string;
    currencies: SummaryCurrencyModel[];
    deductTaxes: boolean;
}

export default function SummaryReport_Currency({ taxCAD, valueFormatCAD, currencies, deductTaxes }: Props) {
    const total = useMemo(() => currencies.reduce((a, b) => a + numberHelper.fromServerDecimal(b.value * b.rate), 0), [currencies]);

    return (
        <div>
            <FormTitle>Currencies</FormTitle>
            <Grid
                columns={[
                    { className: "text-start", title: "Code" },
                    { className: "text-end", title: "Amount" },
                    { className: "text-end", title: "Rate" },
                    { className: "text-end", title: "Amount (CAD)" },
                ]}
            >
                {currencies.map(({ currencyCode, value, valueFormat, rate }) => (
                    <tr key={currencyCode}>
                        <td>{currencyCode}</td>
                        <td className="text-end">
                            <AmountField amount={numberHelper.fromServerDecimal(value)} format={valueFormat} highlight="income and expenses" />
                        </td>
                        <td className="text-end">
                            {numberHelper.formatDecimal(numberHelper.fromServerDecimal(rate), 4)}
                        </td>
                        <td className="text-end">
                            <AmountField amount={numberHelper.fromServerDecimal(value * rate)} format={valueFormatCAD} highlight="income and expenses" />
                        </td>
                    </tr>
                ))}
                <tr>
                    <td colSpan={5} className="text-end">
                        <TotalField
                            total={total}
                            tax={numberHelper.fromServerDecimal(taxCAD)}
                            format={valueFormatCAD}
                            deductTaxes={deductTaxes}
                        />
                    </td>
                </tr>
            </Grid>
        </div>
    );
}