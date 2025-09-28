import EditCol from "@/components/fields/EditCol";
import Grid from "@/components/Grid";
import { WalletRow } from "./WalletRow";

interface Props {
    items: WalletRow[] | undefined | null;
}

export default function WalletSearch_Grid({ items }: Props) {
    return (
        <Grid columns={[
            { },
            { className: "text-start", title: "Name" },
            { className: "text-start", title: "Person" },
            { className: "text-center", title: "Currency" },
            { className: "text-center", title: "Payments" },
        ]}>
            {items && items.map(c => (
                <tr key={c.walletId}>
                    <EditCol
                        editUrl={`/dictionary/wallets/${c.walletId}`}
                        deleteUrl={`/dictionary/wallets/${c.walletId}/delete`}
                    />
                    <td>{c.walletName}</td>
                    <td>{c.personName}</td>
                    <td className="text-center">{c.currencyCode}</td>
                    <td className="text-center">{c.paymentCount}</td>
                </tr>
            ))}
            {!items && (
                <tr>
                    <td colSpan={5}>
                        Loading data...
                    </td>
                </tr>
            )}
        </Grid>
    );
}