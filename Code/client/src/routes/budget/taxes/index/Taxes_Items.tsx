import { TaxIncomeModel } from "@/api/models/TaxIncomeModel";
import { TaxItemModel } from "@/api/models/TaxItemModel";
import { apiDateFormatType } from "@/api/restClient";
import AmountField from "@/components/fields/AmountField";
import FormTitle from "@/components/form/FormTitle";
import Grid from "@/components/Grid";
import { dateHelper } from "@/helpers/date/dateHelper";
import { numberHelper } from "@/helpers/numberHelper";

interface Props {
    taxItems: TaxItemModel[];
    incomes: TaxIncomeModel[];
    valueFormatCAD: string;
    closed?: string | null;
}

export default function Taxes_Items({
    taxItems,
    incomes,
    valueFormatCAD,
    closed
}: Props) {
    const incomeTotalCAD = incomes.length > 0
        ? numberHelper.fromServerDecimal(incomes.reduce((a, b) => a + b.value * b.rate, 0))
        : 0;

    const taxTotalCAD = numberHelper.fromServerDecimal(taxItems.reduce((a, b) => a + b.valueCAD, 0));
    const taxPaidTotalCAD = numberHelper.fromServerDecimal(taxItems.reduce((a, b) => a + b.valuePaidCAD, 0));
    const taxDiffTotalCAD = taxPaidTotalCAD - taxTotalCAD;

    return (
        <div>
            <FormTitle>Taxes</FormTitle>

            <Grid className="mb-3" columns={[
                { className: "text-start", title: "Name" },
                { className: "text-end", title: "Amount" },
                { className: "text-end", title: "Paid" },
                { className: "text-end", title: "Diff" },
            ]}>
                {taxItems.map(c => (
                    <tr key={c.name}>
                        <td>{c.name}</td>
                        <td className="text-end"><AmountField amount={numberHelper.fromServerDecimal(c.valueCAD)} format={valueFormatCAD} /></td>
                        <td className="text-end"><AmountField amount={numberHelper.fromServerDecimal(c.valuePaidCAD)} format={valueFormatCAD} /></td>
                        <td className="text-end"><AmountField amount={numberHelper.fromServerDecimal(c.valuePaidCAD - c.valueCAD)} format={valueFormatCAD} highlight="income and expenses" /></td>
                    </tr>
                ))}
                <tr>
                    <td></td>
                    <td className="text-end font-semibold"><AmountField amount={taxTotalCAD} format={valueFormatCAD} /></td>
                    <td className="text-end font-semibold"><AmountField amount={taxPaidTotalCAD} format={valueFormatCAD} /></td>
                    <td className="text-end font-semibold"><AmountField amount={taxDiffTotalCAD} format={valueFormatCAD} highlight="income and expenses" /></td>
                </tr>
            </Grid>

            <div className="text-end">
                Taxable Income: <b><AmountField amount={incomeTotalCAD} format={valueFormatCAD} /></b>
            </div>

            {closed && (
                <div className="text-end mt-2">
                    Closed: <b>{dateHelper.format(dateHelper.parse(closed, apiDateFormatType), "mmm d, yyyy")}</b>
                </div>
            )}
        </div>
    );
}