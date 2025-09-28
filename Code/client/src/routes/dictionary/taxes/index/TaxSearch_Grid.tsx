import { TaxSettingGridModel } from "@/api/models/TaxSettingGridModel";
import { numberHelper } from "@/helpers/numberHelper";
import AmountField from "@/components/fields/AmountField";
import EditCol from "@/components/fields/EditCol";
import Grid from "@/components/Grid";

interface Props {
    items: TaxSettingGridModel[] | undefined | null;
    valueFormat: string | undefined | null;
}

export default function TaxSearch_Grid({ items, valueFormat }: Props) {
    return (
        <Grid columns={[
            { },
            { className: "text-start", title: "Year" },
            { className: "text-end", title: "CPP Rate" },
            { className: "text-end", title: "CPP Max" },
            { className: "text-end", title: "EI Rate" },
            { className: "text-end", title: "EI Max" },
            { className: "text-end", title: "CPP Basic Exemp." },
            { className: "text-end", title: "Fed. Basic Personal" },
            { className: "text-end", title: "Prov. Basic Personal Amount" },
            { className: "text-end", title: "Canada Employment Base Amount" },
        ]}>
            {items && items.map(c => (
                <tr key={c.year}>
                    <EditCol editUrl={`/dictionary/taxes/${c.year}`} />
                    <td>{c.year}</td>
                    <td className="text-end">{c.cppRate && numberHelper.formatPercent(c.cppRate)}</td>
                    <td className="text-end"><AmountField amount={c.cppMaxAmount} format={valueFormat} isOldFormat={true} /></td>
                    <td className="text-end">{c.eiRate && numberHelper.formatPercent(c.eiRate)}</td>
                    <td className="text-end"><AmountField amount={c.eiMaxAmount} format={valueFormat} isOldFormat={true} /></td>
                    <td className="text-end"><AmountField amount={c.cppBasicExemptionAmount} format={valueFormat} isOldFormat={true} /></td>
                    <td className="text-end"><AmountField amount={c.federalBasicPersonalAmount} format={valueFormat} isOldFormat={true} /></td>
                    <td className="text-end"><AmountField amount={c.provincialBasicPersonalAmount} format={valueFormat} isOldFormat={true} /></td>
                    <td className="text-end"><AmountField amount={c.canadaEmploymentBaseAmount} format={valueFormat} isOldFormat={true} /></td>
                </tr>
            ))}
            {!items && (
                <tr>
                    <td colSpan={10}>
                        Loading data...
                    </td>
                </tr>
            )}
        </Grid>
    );
}