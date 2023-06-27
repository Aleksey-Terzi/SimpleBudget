import { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import TaxSettingGrid from "./components/TaxSettingGrid";
import { TaxSettingGridModel } from "./models/taxSettingGridModel";

export default function TaxSettings() {
    const [items, setItems] = useState<TaxSettingGridModel[]>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        requestHelper.TaxSettings.getTaxSettings()
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
                    Tax Settings
                    {items && <small className="ms-1">({items.length})</small>}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!error ? (
                    <TaxSettingGrid items={items} loading={loading} />
                ) : (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
}