import { useEffect, useState } from "react";
import { Alert, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton";
import LoadingPanel from "../../components/LoadingPanel";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import { CurrencyEditModel } from "./models/currencyEditModel";

export default function CurrencyDelete() {
    const idText = useParams<{ id: string }>().id;
    const id = parseInt(idText!);
    const [error, setError] = useState<string | undefined>();
    const [item, setItem] = useState<CurrencyEditModel>();
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isNaN(id)) {
            setError("The currency is not found");
            return;
        }

        setLoading(true);

        requestHelper.Currencies.getCurrency(id)
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

        requestHelper.Currencies.deleteCurrency(id)
            .then(() => {
                navigate("/currencies");
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>
                    Delete Currency
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && (
                    <>
                        {item && item.walletCount > 0 && (
                            <Alert variant="danger">
                                This currency cannot be deleted because is used in wallets
                            </Alert>
                        )}
                        <Row>
                            <Col md="6">
                                <div className="mb-3">
                                    <label className="form-label">Code</label>
                                    <div>{item?.code}</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Value Format</label>
                                    <div>{item?.valueFormat}</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"># of Wallets</label>
                                    <div>{item?.walletCount}</div>
                                </div>

                                {item && item.walletCount === 0 && (
                                    <LoadingButton
                                        variant="danger"
                                        className="me-1"
                                        loading={deleting}
                                        text="Delete"
                                        loadingText="Deleting..."
                                        onClick={handleDeleteClick}
                                    />
                                )}

                                <Link to="/currencies" className="btn btn-secondary">
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
                {loading && <LoadingPanel text="Loading Currency..." />}
            </Card.Body>
        </Card>
    );
}