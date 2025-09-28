import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { useStatusProvider } from "@/contexts/StatusProvider";
import DeleteForm from "@/routes/_shared/DeleteForm";

export default function CurrencyDelete() {
    const { addStatus } = useStatusProvider();

    return (
        <DeleteForm
            entityName="currency"
            onLoad={async id => {
                const result = await load(id);
                if (!result.allowDelete) {
                    addStatus("warning", "This currency cannot be deleted because is used in wallets");
                }
                return result;
            }}
            onDelete={del}
        />
    );
}

async function load(id: number) {
    const apiModel = await restClient.currencies.get(id);
    const fields = [
        { label: "Code", value: apiModel.code },
        { label: "Format", value: apiModel.valueFormat },
        { label: "# of Wallets", value: apiModel.walletCount },
    ];

    return {
        fields,
        allowDelete: apiModel.walletCount === 0
    };
}

async function del(id: number) {
    await restClient.currencies.del(id);
    cache.onDictionaryChanged("currencies");
}