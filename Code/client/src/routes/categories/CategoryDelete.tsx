import { useEffect, useState } from "react";
import { Alert, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton";
import LoadingPanel from "../../components/LoadingPanel";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import { CategoryEditModel } from "./models/categoryEditModel";

export default function CategoryDelete() {
    const idText = useParams<{ id: string }>().id;
    const id = parseInt(idText!);
    const [error, setError] = useState<string | undefined>();
    const [item, setItem] = useState<CategoryEditModel>();
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isNaN(id)) {
            setError("The category is not found");
            return;
        }

        setLoading(true);

        requestHelper.Categories.getCategory(id)
            .then(r => {
                setItem(r);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    function handleDeleteClick() {
        setDeleting(true);

        requestHelper.Categories.deleteCategory(id)
            .then(() => {
                navigate("/categories");
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>
                    Delete Category
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && (
                    <>
                        {item && item.paymentCount > 0 && (
                            <Alert variant="danger">
                                This category cannot be deleted because is used in payments
                            </Alert>
                        )}
                        <Row>
                            <Col md="6">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <div>{item?.name}</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"># of Payments</label>
                                    <div>{item?.paymentCount}</div>
                                </div>

                                {item && item.paymentCount === 0 && (
                                    <LoadingButton
                                        variant="danger"
                                        className="me-1"
                                        loading={deleting}
                                        text="Delete"
                                        loadingText="Deleting..."
                                        onClick={handleDeleteClick}
                                    />
                                )}

                                <Link to="/categories" className="btn btn-secondary">
                                    Cancel
                                </Link>
                            </Col>
                        </Row>
                    </>
                )}
                {!loading && error && (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
                {loading && <LoadingPanel text="Loading Category..." />}
            </Card.Body>
        </Card>
    );
}