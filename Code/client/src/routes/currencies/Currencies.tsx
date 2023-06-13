import { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import CurrencyGrid from "./components/CurrencyGrid";
import { CurrencyGridModel } from "./models/currencyGridModel";

export default function Categories() {
    const [items, setItems] = useState<CurrencyGridModel[]>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        requestHelper.Currencies.getCurrencies()
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
                    Currencies
                    {items && <small className="ms-1">({items.length})</small>}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!error ? (
                    <CurrencyGrid items={items} loading={loading} />
                ) : (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
}