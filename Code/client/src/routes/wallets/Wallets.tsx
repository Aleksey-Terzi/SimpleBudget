import { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import WalletGrid from "./components/WalletGrid";
import { WalletGridModel } from "./models/walletGridModel";

export default function Wallets() {
    const [items, setItems] = useState<WalletGridModel[]>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        requestHelper.Wallets.getWalletList()
            .then(r => {
                setItems(r);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            })
    }, [])

    return (
        <Card>
            <Card.Header>
                <Card.Title>
                    Wallets
                    {items && <small className="ms-1">({items.length})</small>}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!error ? (
                    <WalletGrid items={items} loading={loading} />
                ) : (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
}