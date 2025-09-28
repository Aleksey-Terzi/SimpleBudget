import { numberHelper } from "@/helpers/numberHelper";
import { dateHelper } from "@/helpers/date/dateHelper";
import EditCol from "@/components/fields/EditCol";
import Grid from "@/components/Grid";
import { CurrencyRow } from "./CurrencyRow";

interface Props {
    items: CurrencyRow[] | undefined | null;
}

export default function CurrencySearch_Grid({ items }: Props) {
    return (
        <Grid columns={[
            { },
            { className: "text-start", title: "Code" },
            { className: "text-start", title: "Format" },
            { className: "text-end", title: "Market Rate" },
            { className: "text-end", title: "Bank Rate" },
        ]}>
            {items && items.map(c => (
                <tr key={c.currencyId}>
                    <EditCol
                        editUrl={`/dictionary/currencies/${c.currencyId}`}
                        deleteUrl={`/dictionary/currencies/${c.currencyId}/delete`}
                    />
                    <td>{c.code}</td>
                    <td>{c.valueFormat}</td>
                    <td className="text-end">
                        {c.marketRate ? numberHelper.formatServerDecimal(c.marketRate, 4) : "N/A"}
                        {c.marketStartDate && (
                            <div className="text-description-text text-xs">
                                {dateHelper.format(c.marketStartDate, "mmm d, yyyy")}
                            </div>
                        )}
                    </td>
                    <td className="text-end">
                        {c.bankRate ? numberHelper.formatServerDecimal(c.bankRate, 4) : "N/A"}
                        {c.bankStartDate && (
                            <div className="text-description-text text-xs">
                                {dateHelper.format(c.bankStartDate, "mmm d, yyyy")}
                            </div>
                        )}
                    </td>
                </tr>
            ))}
            {!items && (
                <tr>
                    <td colSpan={5}>
                        Loading data...
                    </td>
                </tr>
            )}
        </Grid>
    );
}