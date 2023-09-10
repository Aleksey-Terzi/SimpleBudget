import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductPriceEditModel } from "./models/productPriceEditModel";
import requestHelper from "../../utils/requestHelper";
import filterHelper from "./utils/productPriceFilterHelper";
import { Alert, Card, Col, Row } from "react-bootstrap";
import numberHelper from "../../utils/numberHelper";
import LoadingPanel from "../../components/LoadingPanel";
import LoadingButton from "../../components/LoadingButton";
import responseHelper from "../../utils/responseHelper";
import dateHelper from "../../utils/dateHelper";

export default function PaymentDelete() {
    const idText = useParams<{ id: string }>().id;
    const id = parseInt(idText!);
    const [error, setError] = useState<string | undefined>();
    const [model, setModel] = useState<ProductPriceEditModel>();
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const cancelProductPricesUrl = filterHelper.getProductPricesUrl(undefined, id);

    useEffect(() => {
        if (isNaN(id)) {
            setError("The product price is not found")
            return;
        }

        setLoading(true);

        requestHelper.ProductPrices.getProductPrice(id)
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

        requestHelper.ProductPrices.deleteProductPrice(id!)
            .then(() => {
                const paymentsUrl = filterHelper.getProductPricesUrl();

                navigate(paymentsUrl);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            });
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>
                    Delete Product Price #{idText}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && model && (
                    <Row>
                        <Col md="6">
                            <div className="mb-3">
                                <label className="form-label">Price Date</label>
                                <div>{dateHelper.formatDate(model.priceDate)}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Product</label>
                                <div>{model.productName}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Company</label>
                                <div>{model.companyName || "None"}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <div>{model.categoryName || "None"}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <div>{model.description || "None"}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Value</label>
                                <div>
                                    {numberHelper.formatNumber(model.price)}
                                    {model.isDiscount ? <span className="ms-2">(Discounted)</span> : ""}
                                </div>
                            </div>

                            <LoadingButton
                                variant="danger"
                                className="me-1"
                                loading={deleting}
                                text="Delete"
                                loadingText="Deleting..."
                                onClick={onDelete}
                            />

                            <Link to={cancelProductPricesUrl} className="btn btn-secondary">
                                Cancel
                            </Link>
                        </Col>
                    </Row>
                )}
                {!loading && error && (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
                {loading && <LoadingPanel text="Loading Product Price..." />}
            </Card.Body>
        </Card>
    );
}