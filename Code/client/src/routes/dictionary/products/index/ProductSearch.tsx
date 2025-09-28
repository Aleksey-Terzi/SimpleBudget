import { restClient } from "@/api/restClient";
import { useDictionarySearch } from "@/hooks/useDictionarySearch";
import FormSection from "@/components/form/FormSection";
import { ProductRow } from "./ProductRow";
import ProductSearch_Grid from "./ProductSearch_Grid";

export default function ProductSearch() {
    const { model } = useDictionarySearch("products", async (): Promise<ProductRow[]> => {
        const apiRows = await restClient.products.all();
        return apiRows.map(row => ({
            productId: row.productId,
            productName: row.productName,
            categoryName: row.categoryName ?? null,
            priceCount: row.priceCount,
        }));
    });

    return (
        <FormSection>
            <ProductSearch_Grid items={model} />
        </FormSection>
    );
}