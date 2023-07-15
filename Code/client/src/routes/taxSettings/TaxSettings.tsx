import { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import TaxSettingGrid from "./components/TaxSettingGrid";
import { TaxSettingModel } from "./models/taxSettingModel";

export default function TaxSettings() {
    const [model, setModel] = useState<TaxSettingModel>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        requestHelper.TaxSettings.getTaxSettings()
            .then(r => {
                setModel(r);
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
                    {model?.items && <small className="ms-1">({model.items.length})</small>}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!error ? (
                    <TaxSettingGrid valueFormat={model?.valueFormat} items={model?.items} loading={loading} />
                ) : (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
}