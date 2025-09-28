import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { useStatusProvider } from "@/contexts/StatusProvider";
import DeleteForm from "@/routes/_shared/DeleteForm";

export default function ProductDelete() {
    const { addStatus } = useStatusProvider();

    return (
        <DeleteForm
            entityName="product"
            onLoad={async id => {
                const result = await load(id);
                if (!result.allowDelete) {
                    addStatus("warning", "This product cannot be deleted because is used in prices");
                }
                return result;
            }}
            onDelete={del}
        />
    );
}

async function load(id: number) {
    const apiModel = await restClient.products.get(id);
    const fields = [
        { label: "Product Name", value: apiModel.productName },
        { label: "Category", value: apiModel.categoryName },
        { label: "# of Prices", value: apiModel.priceCount },
    ];

    return {
        fields,
        allowDelete: apiModel.priceCount === 0
    };
}

async function del(id: number) {
    await restClient.products.del(id);
    cache.onDictionaryChanged("products");
}