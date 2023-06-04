import { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import LoadingPanel from "../../components/LoadingPanel";
import paramHelper from "../../utils/paramHelper";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import CompanyDetail from "./components/CompanyDetail";
import { CompanyEditModel } from "./models/companyEditModel";

export default function CategoryEdit() {
    const idText = useParams<{ id: string }>().id;
    const { id, action } = paramHelper.getEditorModel(idText);
    const [model, setModel] = useState<CompanyEditModel>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (action === "add") return;

        setLoading(true);

        requestHelper.Companies.getCompany(id!)
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
            name: values["name"],
            paymentCount: 0
        };

        setSaving(true);

        const promise = id
            ? requestHelper.Companies.updateCompany(id, item)
            : requestHelper.Companies.createCompany(item);

        promise
            .then(() => {
                navigate("/companies");
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
                setSaving(false);
            });
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>
                    {action === "edit" ? (
                        <>Edit Company</>
                    ) : (
                        <>Add Company</>
                    )}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && (
                    <CompanyDetail id={id} action={action} model={model} saving={saving} onSave={handleSave} />
                )}
                {!loading && error && (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
                {loading && <LoadingPanel text="Initializing Screen..." />}
            </Card.Body>
        </Card>
    );
}