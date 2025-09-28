import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { useStatusProvider } from "@/contexts/StatusProvider";
import DeleteForm from "@/routes/_shared/DeleteForm";

export default function CategoryDelete() {
    const { addStatus } = useStatusProvider();

    return (
        <DeleteForm
            entityName="category"
            onLoad={async id => {
                const result = await load(id);
                if (!result.allowDelete) {
                    addStatus("warning", "This category cannot be deleted because is used in payments");
                }
                return result;
            }}
            onDelete={del}
        />
    );
}

async function load(id: number) {
    const apiModel = await restClient.categories.get(id);
    const fields = [
        { label: "Name", value: apiModel.name },
        { label: "# of Payments", value: apiModel.paymentCount },
    ];

    return {
        fields,
        allowDelete: apiModel.paymentCount === 0
    };
}

async function del(id: number) {
    await restClient.categories.del(id);
    cache.onDictionaryChanged("categories");
}