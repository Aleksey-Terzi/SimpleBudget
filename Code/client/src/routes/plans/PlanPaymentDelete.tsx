import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PlanPaymentModel } from "./models/planPaymentModel";
import requestHelper from "../../utils/requestHelper";
import planPaymentFilterHelper from "./utils/planPaymentFilterHelper";
import { Alert, Card, Col, Row } from "react-bootstrap";
import numberHelper from "../../utils/numberHelper";
import LoadingPanel from "../../components/LoadingPanel";
import LoadingButton from "../../components/LoadingButton";
import { useAppSelector } from "../../utils/storeHelper";
import responseHelper from "../../utils/responseHelper";

const filterHelper = planPaymentFilterHelper;

export default function PaymentDelete() {
    const idText = useParams<{ id: string }>().id;
    const id = parseInt(idText!);
    const [error, setError] = useState<string | undefined>();
    const [item, setItem] = useState<PlanPaymentModel | undefined>();
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const { filter } = useAppSelector(state => state.planPayment);
    const cancelPaymentsUrl = filterHelper.getPlanPaymentsUrl(filter, id);

    useEffect(() => {
        if (isNaN(id)) {
            setError("The plan payment is not found")
            return;
        }

        setLoading(true);

        requestHelper.PlanPayments.getPlanPayment(id)
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

        requestHelper.PlanPayments.deletePlanPayment(id!)
            .then(() => {
                const paymentsUrl = filterHelper.getPlanPaymentsUrl(filter);

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
                    Delete Payment #{idText}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && (
                    <Row>
                        <Col md="6">
                            <div className="mb-3">
                                <label className="form-label">Type</label>
                                <div>{item?.paymentType}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Is Active/</label>
                                <div>{item?.isActive ? "Yes" : "No"}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Date Range</label>
                                <div>{item?.startDate}{item?.endDate && ` - ${item.endDate}`}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Company</label>
                                <div>{item?.company || "None"}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <div>{item?.category || "None"}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Wallet</label>
                                <div>{item?.wallet}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <div>{item?.description || "None"}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Value</label>
                                <div>{numberHelper.formatNumber(item?.value)}</div>
                            </div>

                            <LoadingButton
                                variant="danger"
                                className="me-1"
                                loading={deleting}
                                text="Delete"
                                loadingText="Deleting..."
                                onClick={handleDeleteClick}
                            />

                            <Link to={cancelPaymentsUrl} className="btn btn-secondary">
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
                {loading && <LoadingPanel text="Loading Payment..." />}
            </Card.Body>
        </Card>
    );
}