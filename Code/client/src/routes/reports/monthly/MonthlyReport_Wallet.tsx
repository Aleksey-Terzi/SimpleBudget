import { MonthlyWalletModel } from "@/api/models/MonthlyWalletModel";
import AmountField from "@/components/fields/AmountField";
import FormTitle from "@/components/form/FormTitle";
import Grid from "@/components/Grid";
import AmountAndRate from "./MonthlyReport_AmountAndRate";
import { numberHelper } from "@/helpers/numberHelper";

interface Props {
    wallets: MonthlyWalletModel[];
    formatCAD: string;
}

export default function MonthlyReport_Wallet({
    wallets,
    formatCAD
}: Props) {
    let totalBeginningCAD = 0;
    let totalCurrentCAD = 0;
    let totalDiffCAD = 0;

    for (const item of wallets) {
        totalBeginningCAD += numberHelper.fromServerDecimal(item.beginning * item.beginningRate);
        totalCurrentCAD += numberHelper.fromServerDecimal(item.current * item.currentRate);
    }

    totalDiffCAD += totalCurrentCAD - totalBeginningCAD;

    return (
        <div>
            <FormTitle>Spendings by Wallets</FormTitle>

            <Grid className="mb-3" columns={[
                { className: "text-start", title: "Wallet" },
                { className: "text-end", title: "Beginning" },
                { className: "text-end", title: "Current" },
                { className: "text-end", title: "Diff" },
            ]}>
                {wallets.map(({ walletName, beginning, beginningRate, current, currentRate, valueFormat, currencyCode }) => (
                    <tr key={walletName}>
                        <td>{walletName}</td>
                        <td className="text-end">
                            <AmountAndRate
                                currencyCode={currencyCode}
                                rate={beginningRate}
                                amount={numberHelper.fromServerDecimal(beginning)}
                                format={valueFormat}
                                formatCAD={formatCAD}
                            />
                        </td>
                        <td className="text-end">
                            <AmountAndRate
                                currencyCode={currencyCode}
                                rate={currentRate}
                                amount={numberHelper.fromServerDecimal(current)}
                                format={valueFormat}
                                formatCAD={formatCAD}
                            />
                        </td>
                        <td className="text-end">
                            <AmountField
                                amount={numberHelper.fromServerDecimal(current * currentRate - beginning * beginningRate)}
                                format={formatCAD}
                                highlight="income and expenses"
                            />
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