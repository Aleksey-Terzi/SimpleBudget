import { useEffect, useState } from "react";
import { Alert, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton";
import LoadingPanel from "../../components/LoadingPanel";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import { ProductEditModel } from "./models/productEditModel";

export default function ProductDelete() {
    const idText = useParams<{ id: string }>().id;
    const id = parseInt(idText!);
    const [error, setError] = useState<string>();
    const [model, setModel] = useState<ProductEditModel>();
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isNaN(id)) {
            setError("The product is not found");
            return;
        }

        setLoading(true);

        requestHelper.Products.getProduct(id)
            .then(r => {
                setModel(r);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    function onDelete() {
        setDeleting(true);

        requestHelper.Products.deleteProduct(id)
            .then(() => {
                navigate("/products");
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>
                    Delete Product
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && model && (
                    <>
                        {model.priceCount > 0 && (
                            <Alert variant="danger">
                                This product cannot be deleted because is used in prices
                            </Alert>
                        )}
                        <Row>
                            <Col md="6">
                                <div className="mb-3">
                                    <label className="form-label">Product Name</label>
                                    <div>{model.productName}</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <div>{model.categoryName}</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"># of Payments</label>
                                    <div>{model.priceCount}</div>
                                </div>

                                {model.priceCount === 0 && (
                                    <LoadingButton
                                        variant="danger"
                                        className="me-1"
                                        loading={deleting}
                                        text="Delete"
                                        loadingText="Deleting..."
                                        onClick={onDelete}
                                    />
                                )}

                                <Link to="/products" className="btn btn-secondary">
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
                {loading && <LoadingPanel text="Loading Product..." />}
            </Card.Body>
        </Card>
    );
}