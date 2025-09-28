import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { useStatusProvider } from "@/contexts/StatusProvider";
import DeleteForm from "@/routes/_shared/DeleteForm";

export default function WalletDelete() {
    const { addStatus } = useStatusProvider();

    return (
        <DeleteForm
            entityName="wallet"
            onLoad={async id => {
                const result = await load(id);
                if (!result.allowDelete) {
                    addStatus("warning", "This wallet cannot be deleted because is used in payments");
                }
                return result;
            }}
            onDelete={del}
        />
    );
}

async function load(id: number) {
    const apiModel = await restClient.wallets.get(id, true);
    const fields = [
        { label: "Name", value: apiModel.walletName },
        { label: "Person", value: apiModel.personName },
        { label: "Currency", value: apiModel.currencyCode },
        { label: "# of Payments", value: apiModel.paymentCount },
    ];

    return {
        fields,
        allowDelete: apiModel.paymentCount === 0
    };
}

async function del(id: number) {
    await restClient.wallets.del(id);
    cache.onDictionaryChanged("wallets");
}