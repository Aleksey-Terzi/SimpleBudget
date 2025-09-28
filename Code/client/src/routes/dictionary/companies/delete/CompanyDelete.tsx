import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { useStatusProvider } from "@/contexts/StatusProvider";
import DeleteForm from "@/routes/_shared/DeleteForm";

export default function CompanyDelete() {
    const { addStatus } = useStatusProvider();

    return (
        <DeleteForm
            entityName="company"
            onLoad={async id => {
                const result = await load(id);
                if (!result.allowDelete) {
                    addStatus("warning", "This company cannot be deleted because is used in payments");
                }
                return result;
            }}
            onDelete={del}
        />
    );
}

async function load(id: number) {
    const apiModel = await restClient.companies.get(id);
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
    await restClient.companies.del(id);
    cache.onDictionaryChanged("companies");
}