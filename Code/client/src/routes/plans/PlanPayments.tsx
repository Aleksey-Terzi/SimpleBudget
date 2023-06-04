import { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import PlanPaymentFilter from "./components/PlanPaymentFilter";
import PlanPaymentGrid from "./components/PlanPaymentGrid";
import { useSearchParams } from "react-router-dom";
import planPaymentFilterHelper from "./utils/planPaymentFilterHelper";
import { useAppDispatch, useAppSelector } from "../../utils/storeHelper";
import { setPlanPayments } from "./models/planPaymentSlice";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";

export default function PlanPayments() {
    const { planPayments, paginationData } = useAppSelector(state => state.planPayment);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [searchParams] = useSearchParams();
    const filter = planPaymentFilterHelper.getPlanPaymentFilter(searchParams);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setLoading(true);

        const searchFilter = planPaymentFilterHelper.getPlanPaymentFilter(searchParams);

        requestHelper.PlanPayments.search(searchFilter)
            .then(r => {
                dispatch(setPlanPayments({ planPayments: r.items, paginationData: r.paginationData, filter: searchFilter }));
                setError(undefined);
            })
            .catch(e => {
                dispatch(setPlanPayments({ planPayments: undefined, paginationData: undefined }));
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            });

    }, [searchParams, dispatch])

    return (
        <Card>
            <Card.Header>
                <Card.Title>Plan Payments</Card.Title>
            </Card.Header>
            <Card.Body>
                <PlanPaymentFilter filter={filter} />
                {!error ? (
                    <PlanPaymentGrid
                        selectedPlanPaymentId={filter.id}
                        filter={filter}
                        planPayments={!loading ? planPayments : undefined}
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