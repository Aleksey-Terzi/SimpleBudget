import { TaxIncomeModel } from "@/api/models/TaxIncomeModel";
import { apiDateFormatType } from "@/api/restClient";
import AmountField from "@/components/fields/AmountField";
import FormTitle from "@/components/form/FormTitle";
import Grid from "@/components/Grid";
import { dateHelper } from "@/helpers/date/dateHelper";
import { numberHelper } from "@/helpers/numberHelper";

interface Props {
    incomes: TaxIncomeModel[];
    valueFormatCAD: string;
}

export default function Taxes_Income({ incomes, valueFormatCAD }: Props) {
    const incomeTotalCAD = incomes.length > 0
        ? numberHelper.fromServerDecimal(incomes.reduce((a, b) => a + b.value * b.rate, 0))
        : 0;

    return (
        <div>
            <FormTitle>Taxable Income</FormTitle>

            <Grid columns={[
                { className: "text-start", title: "Date" },
                { className: "text-start", title: "Description" },
                { className: "text-start", title: "Wallet" },
                { className: "text-end", title: "Amount" },
            ]}>
                {incomes.map(c => (
                    <tr key={c.paymentId}>
                        <td>
                            {dateHelper.format(dateHelper.parse(c.paymentDate, apiDateFormatType), "mmm d, yyyy")}
                            <span className="text-description-text text-xs ms-1">
                                #{c.paymentId}
                            </span>
                        </td>
                        <td>
                            {c.description}
                            {(c.companyName || c.categoryName) && (
                                <div className="text-description-text text-xs">
                                    {c.companyName || ""}
                                    {c.companyName && c.categoryName ? "/" : ""}
                                    {c.categoryName || ""}
                                </div>
                            )}
                        </td>
                        <td>
                            {c.walletName}
                        </td>
                        <td className="text-end">
                            <AmountField amount={numberHelper.fromServerDecimal(c.value * c.rate)} format={valueFormatCAD} />
                            {c.currencyCode.toLowerCase() !== "cad" && (
                                <div className="text-description-text text-xs">
                                    {numberHelper.formatServerDecimal(c.rate, 4)} @ <AmountField amount={c.value} format={c.valueFormat} />
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                <tr className="font-semibold">
                    <td colSpan={4} className="text-end">
                        <AmountField amount={incomeTotalCAD} format={valueFormatCAD} />
                    </td>
                </tr>
            </Grid>
        </div>
    );
}