import EditCol from "@/components/fields/EditCol";
import Grid from "@/components/Grid";
import { CategoryRow } from "./CategoryRow";

interface Props {
    items: CategoryRow[] | undefined | null;
}

export default function CategorySearch_Grid({ items }: Props) {
    return (
        <Grid columns={[
            { },
            { className: "text-start", title: "Name" },
            { className: "text-center", title: "Payments" },
        ]}>
            {items && items.map(c => (
                <tr key={c.categoryId}>
                    <EditCol
                        editUrl={`/dictionary/categories/${c.categoryId}`}
                        deleteUrl={`/dictionary/categories/${c.categoryId}/delete`}
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