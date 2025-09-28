import EditCol from "@/components/fields/EditCol";
import Grid from "@/components/Grid";
import { ProductRow } from "./ProductRow";

interface Props {
    items: ProductRow[] | undefined | null;
}

export default function ProductSearch_Grid({ items }: Props) {
    return (
        <Grid columns={[
            { },
            { className: "text-start", title: "Product" },
            { className: "text-start", title: "Category" },
            { className: "text-center", title: "Prices" },
        ]}>
            {items && items.map(c => (
                <tr key={c.productId}>
                    <EditCol
                        editUrl={`/dictionary/products/${c.productId}`}
                        deleteUrl={`/dictionary/products/${c.productId}/delete`}
                    />
                    <td>{c.productName}</td>
                    <td>{c.categoryName}</td>
                    <td className="text-center">{c.priceCount}</td>
                </tr>
            ))}
            {!items && (
                <tr>
                    <td colSpan={4}>
                        Loading data...
                    </td>
                </tr>
            )}
        </Grid>
    );
}