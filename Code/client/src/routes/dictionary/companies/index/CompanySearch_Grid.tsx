import EditCol from "@/components/fields/EditCol";
import Grid from "@/components/Grid";
import { CompanyRow } from "./CompanyRow";

interface Props {
    items: CompanyRow[] | undefined | null;
}

export default function CompanySearch_Grid({ items }: Props) {
    return (
        <Grid columns={[
            { },
            { className: "text-start", title: "Name" },
            { className: "text-center", title: "Payments" },
        ]}>
            {items && items.map(c => (
                <tr key={c.companyId}>
                    <EditCol
                        editUrl={`/dictionary/companies/${c.companyId}`}
                        deleteUrl={`/dictionary/companies/${c.companyId}/delete`}
                    />
                    <td>{c.name}</td>
                    <td className="text-center">{c.paymentCount}</td>
                </tr>
            ))}
            {!items && (
                <tr>
                    <td colSpan={3}>
                        Loading data...
                    </td>
                </tr>
            )}
        </Grid>
    );
}