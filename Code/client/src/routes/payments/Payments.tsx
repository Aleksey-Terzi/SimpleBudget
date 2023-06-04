import { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import PaymentFilter from "./components/PaymentFilter";
import PaymentGrid from "./components/PaymentGrid";
import { useSearchParams } from "react-router-dom";
import paymentFilterHelper from "./utils/paymentFilterHelper";
import { useAppDispatch, useAppSelector } from "../../utils/storeHelper";
import { setPayments } from "./models/paymentSlice";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";

export default function Payments() {
    const { payments, paginationData } = useAppSelector(state => state.payment);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [searchParams] = useSearchParams();
    const filter = paymentFilterHelper.getPaymentFilter(searchParams);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setLoading(true);

        const searchFilter = paymentFilterHelper.getPaymentFilter(searchParams);

        requestHelper.Payments.search(searchFilter)
            .then(r => {
                dispatch(setPayments({ payments: r.items, paginationData: r.paginationData, filter: searchFilter }));
                setError(undefined);
            })
            .catch(e => {
                dispatch(setPayments({ payments: undefined, paginationData: undefined }));
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            });

    }, [searchParams, dispatch])

    return (
        <Card>
            <Card.Header>
                <Card.Title>Payments</Card.Title>
            </Card.Header>
            <Card.Body>
                <PaymentFilter filter={filter} />
                {!error ? (
                    <PaymentGrid
                        selectedPaymentId={filter.id}
                        filter={filter}
                        payments={!loading ? payments : undefined}
                        paginationData={paginationData}
                    />
                ) : (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
}