import { MonthlySummaryModel } from "@/api/models/MonthlySummaryModel";
import AmountField from "@/components/fields/AmountField";
import FormTitle from "@/components/form/FormTitle";
import Grid from "@/components/Grid";
import { numberHelper } from "@/helpers/numberHelper";

interface Props {
    summaries: MonthlySummaryModel[];
    formatCAD: string;
}

export default function MonthlyReport_Summary({
    summaries,
    formatCAD
}: Props) {
    let totalBeginningCAD = 0;
    let totalCurrentCAD = 0;
    let totalDiffCAD = 0;

    for (const item of summaries) {
        totalBeginningCAD += numberHelper.fromServerDecimal(item.beginningCAD);
        totalCurrentCAD += numberHelper.fromServerDecimal(item.currentCAD);
    }

    totalDiffCAD += totalCurrentCAD - totalBeginningCAD;

    return (
        <div>
            <FormTitle>Spendings by Wallets</FormTitle>

            <Grid className="mb-3" columns={[
                { className: "text-start", title: "Name" },
                { className: "text-end", title: "Beginning" },
                { className: "text-end", title: "Current" },
                { className: "text-end", title: "Diff" },
            ]}>
                {summaries.map(({ name, beginningCAD, currentCAD }) => (
                    <tr key={name}>
                        <td>{name}</td>
                        <td className="text-end">
                            <AmountField amount={numberHelper.fromServerDecimal(beginningCAD)} format={formatCAD} highlight="income and expenses" />
                        </td>
                        <td className="text-end">
                            <AmountField amount={numberHelper.fromServerDecimal(currentCAD)} format={formatCAD} highlight="income and expenses" />
                        </td>
                        <td className="text-end">
                            <AmountField amount={numberHelper.fromServerDecimal(currentCAD - beginningCAD)} format={formatCAD} highlight="income and expenses" />
                        </td>
                    </tr>
                ))}
                <tr className="font-semibold">
                    <td colSpan={2} className="text-end">
                        <AmountField amount={totalBeginningCAD} format={formatCAD} highlight="income and expenses" />
                    </td>
                    <td className="text-end">
                        <AmountField amount={totalCurrentCAD} format={formatCAD} highlight="income and expenses" />
                    </td>
                    <td className="text-end">
                        <AmountField amount={totalDiffCAD} format={formatCAD} highlight="income and expenses" />
                    </td>
                </tr>
            </Grid>
        </div>
    )
}