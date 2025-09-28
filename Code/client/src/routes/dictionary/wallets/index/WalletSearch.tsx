import { restClient } from "@/api/restClient";
import { useDictionarySearch } from "@/hooks/useDictionarySearch";
import FormSection from "@/components/form/FormSection";
import { WalletRow } from "./WalletRow";
import WalletSearch_Grid from "./WalletSearch_Grid";

export default function WalletSearch() {
    const { model } = useDictionarySearch("wallets", async (): Promise<WalletRow[]> => {
        const apiRows = await restClient.wallets.all();
        return apiRows.map(row => ({
            walletId: row.walletId,
            walletName: row.walletName,
            personName: row.personName ?? null,
            currencyCode: row.currencyCode,
            paymentCount: row.paymentCount,
        }));
    });

    return (
        <FormSection>
            <WalletSearch_Grid items={model} />
        </FormSection>
    );
}