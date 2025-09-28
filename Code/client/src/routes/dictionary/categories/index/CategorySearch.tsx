import { restClient } from "@/api/restClient";
import { useDictionarySearch } from "@/hooks/useDictionarySearch";
import FormSection from "@/components/form/FormSection";
import { CategoryRow } from "./CategoryRow";
import CategorySearch_Grid from "./CategorySearch_Grid";

export default function CategorySearch() {
    const { model } = useDictionarySearch("categories", async (): Promise<CategoryRow[]> => {
        const apiRows = await restClient.categories.all();
        return apiRows.map(row => ({
            categoryId: row.categoryId,
            name: row.name,
            paymentCount: row.paymentCount,
        }));
    });

    return (
        <FormSection>
            <CategorySearch_Grid items={model} />
        </FormSection>
    );
}