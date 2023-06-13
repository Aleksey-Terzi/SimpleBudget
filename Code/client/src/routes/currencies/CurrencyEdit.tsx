import { useEffect, useState } from "react";
import { Alert, Card, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import LoadingPanel from "../../components/LoadingPanel";
import paramHelper from "../../utils/paramHelper";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import CurrencyDetail from "./components/CurrencyDetail";
import CurrencyRatingGrid from "./components/CurrencyRateGrid";
import { CurrencyEditModel } from "./models/currencyEditModel";

export default function CategoryEdit() {
    const idText = useParams<{ id: string }>().id;
    const { id, action } = paramHelper.getEditorModel(idText);
    const [model, setModel] = useState<CurrencyEditModel>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (action === "add") return;

        setLoading(true);

        requestHelper.Currencies.getCurrency(id!)
            .then(r => {
                setModel(r);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            })
    }, [action, id]);

    function handleSave(values: any) {
        const item = {
            code: values["code"],
            valueFormat: values["valueFormat"],
            walletCount: 0
        };

        setSaving(true);

        const promise = id
            ? requestHelper.Currencies.updateCurrency(id, item)
            : requestHelper.Currencies.createCurrency(item);

        promise
            .then(r => {
                if (id) {
                    navigate("/currencies");
                } else {
                    const url = `/currencies/${r}`;
                    navigate(url);
                }
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setSaving(false);
            })
    }

    return (
        <Row>
            <Col md="6">
                <Card className="h-100">
                    <Card.Header>
                        <Card.Title>
                            {action === "edit" ? (
                                <>Edit Currency</>
                            ) : (
                                <>Add Currency</>
                            )}
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {!loading && !error && (
                            <CurrencyDetail id={id} action={action} model={model} saving={saving} onSave={handleSave} />
                        )}
                        {!loading && error && (
                            <Alert variant="danger">
                                {error}
                            </Alert>
                        )}
                        {loading && <LoadingPanel text="Initializing Screen..." />}
                    </Card.Body>
                </Card>
            </Col>
            {action === "edit" && (
                <Col md="6">
                    <CurrencyRatingGrid currencyId={id!} />
                </Col>
            )}
        </Row>
    );
}