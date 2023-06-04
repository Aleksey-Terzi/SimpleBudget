import { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import CategoryGrid from "./components/CategoryGrid";
import { CategoryGridModel } from "./models/categoryGridModel";

export default function Categories() {
    const [items, setItems] = useState<CategoryGridModel[]>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        requestHelper.Categories.getCategoryList()
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
                    Categories
                    {items && <small className="ms-1">({items.length})</small>}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!error ? (
                    <CategoryGrid items={items} loading={loading} />
                ) : (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
}