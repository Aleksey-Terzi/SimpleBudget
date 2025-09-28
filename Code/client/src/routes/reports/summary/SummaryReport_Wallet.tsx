import { SummaryWalletModel } from "@/api/models/SummaryWalletModel";
import AmountField from "@/components/fields/AmountField";
import TotalField from "@/components/fields/TotalField";
import FormTitle from "@/components/form/FormTitle";
import Grid from "@/components/Grid";
import { numberHelper } from "@/helpers/numberHelper";
import { useMemo } from "react";

interface Props {
    taxCAD: number;
    valueFormatCAD: string;
    wallets: SummaryWalletModel[];
    deductTaxes: boolean;
}

export default function SummaryReport_Wallet({ taxCAD, valueFormatCAD, wallets, deductTaxes }: Props) {
    const total = useMemo(() => wallets.reduce((a, b) => a + numberHelper.fromServerDecimal(b.value * b.rate), 0), [wallets]);

    return (
        <div>
            <FormTitle>Wallets</FormTitle>

            <Grid
                columns={[
                    { className: "text-start", title: "Name" },
                    { className: "text-center", title: "Currency" },
                    { className: "text-end", title: "Amount" },
                    { className: "text-end", title: "Rate" },
                    { className: "text-end", title: "Amount (CAD)" },
                ]}
            >
                {wallets.map(({ walletName, currencyCode, value, valueFormat, rate }) => (
                    <tr key={walletName}>
                        <td>{walletName}</td>
                        <td className="text-center">{currencyCode}</td>
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
    )
}