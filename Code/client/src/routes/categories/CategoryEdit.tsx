import { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import LoadingPanel from "../../components/LoadingPanel";
import paramHelper from "../../utils/paramHelper";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import CategoryDetail from "./components/CategoryDetail";
import { CategoryEditModel } from "./models/categoryEditModel";

export default function CategoryEdit() {
    const idText = useParams<{ id: string }>().id;
    const { id, action } = paramHelper.getEditorModel(idText);
    const [model, setModel] = useState<CategoryEditModel>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (action === "add") return;

        setLoading(true);

        requestHelper.Categories.getCategory(id!)
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
            ? requestHelper.Categories.updateCategory(id, item)
            : requestHelper.Categories.createCategory(item);

        promise
            .then(() => {
                navigate("/categories");
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
                        <>Edit Category</>
                    ) : (
                        <>Add Category</>
                    )}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && (
                    <CategoryDetail id={id} action={action} model={model} saving={saving} onSave={handleSave} />
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