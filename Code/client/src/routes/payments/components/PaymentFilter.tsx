import { useEffect, useState } from "react";
import { Alert, ButtonGroup, Col, Row, } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "../../../components/LoadingButton";
import numberHelper from "../../../utils/numberHelper";
import requestHelper from "../../../utils/requestHelper";
import responseHelper from "../../../utils/responseHelper";
import { useAppDispatch, useAppSelector } from "../../../utils/storeHelper";
import userHelper from "../../../utils/userHelper";
import { PaymentFilterModel } from "../models/paymentFilterModel";
import { revertCalcSum, setSum } from "../models/paymentSlice";
import paymentFilterHelper from "../utils/paymentFilterHelper";
import PaymentAdvancedFilter from "./PaymentAdvancedFilter";
import PaymentSimpleFilter from "./PaymentSimpleFilter";

const filterHelper = paymentFilterHelper;

interface Props {
    filter?: PaymentFilterModel;
    loading: boolean;
}

export default function PaymentFilter({ filter, loading }: Props) {
    const { calcSum, sum, sumFormat } = useAppSelector(state => state.payment);
    const dispatch = useAppDispatch();
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [isSimpleFilter, setIsSimpleFilter] = useState(true);

    const filterNoType = { ...filter, type: undefined };
    const expensesParams = filterHelper.getPaymentFilterParams(filter?.type === "expenses" ? filterNoType : { ...filter, type: "expenses" }, false, false) || "";
    const incomeParams = filterHelper.getPaymentFilterParams(filter?.type === "income" ? filterNoType : { ...filter, type: "income" }, false, false) || "";
    const transferParams = filterHelper.getPaymentFilterParams(filter?.type === "transfer" ? filterNoType : { ...filter, type: "transfer" }, false, false) || "";

    const expensesClass = filter?.type === "expenses" ? " active" : "";
    const incomeClass = filter?.type === "income" ? " active" : "";
    const transferClass = filter?.type === "transfer" ? " active" : "";

    const hasFilter = !!filter;
    const text = filter?.text;
    const type = filter?.type;

    const navigate = useNavigate();

    useEffect(() => {
        const defaultIsSimpleFilter = !text || text.length === 0
            ? userHelper.getPaymentsFilterType() !== "Advanced"
            : paymentFilterHelper.isSimpleFilter(text);

        setIsSimpleFilter(defaultIsSimpleFilter);
    }, [text]);

    useEffect(() => {
        if (!calcSum || !hasFilter) {
            return;
        }

        const searchFilter: PaymentFilterModel = {
            text,
            type
        };

        setCalculating(true);

        requestHelper.Payments.sum(searchFilter)
            .then(r => {
                dispatch(setSum({
                    sum: r.sum,
                    sumFormat: r.valueFormat
                }));
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setCalculating(false);
            });
    }, [hasFilter, text, type, calcSum, dispatch]);

    function onSearchByText(text: string) {
        const searchFilter = { ...filter, text, page: undefined };

        const filterParams = filterHelper.getPaymentFilterParams(searchFilter);
        const url = "?" + (filterParams || "");

        navigate(url);
    }

    function onSwitchFilter() {
        const filterType = isSimpleFilter ? "Advanced" : "Simple";

        userHelper.setPaymentsFilterType(filterType);

        setIsSimpleFilter(!isSimpleFilter);
    }

    function onCalcSumClick() {
        dispatch(revertCalcSum());
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>
    }

    return (
        <Row className="mb-3">
            <Col lg="6">
                {isSimpleFilter ? (
                    <PaymentSimpleFilter
                        filter={filter}
                        onSearchByText={onSearchByText}
                        onSwitchFilter={onSwitchFilter}
                    />
                ) : (
                    <PaymentAdvancedFilter
                        filter={filter}
                        loading={loading}
                        onSearchByText={onSearchByText}
                        onSwitchFilter={onSwitchFilter}
                    />
                )}
            </Col>
            <Col lg="6">
                <div className="float-end mb-3">
                    <LoadingButton
                        variant="outline-secondary"
                        className="me-2"
                        onClick={onCalcSumClick}
                        loadingText="Calculating..."
                        loading={calculating}
                        disabled={!filter}
                        tabIndex={-1}
                    >
                        {calcSum && sum && sumFormat
                            ? <>Sum: {numberHelper.formatCurrency(sum, sumFormat, "positiveAndNegative")}</>
                            : "Calc Sum"
                        }
                    </LoadingButton>

                    <ButtonGroup className="me-2">
                        <Link className={`btn btn-outline-secondary${expensesClass}`} to={`?${expensesParams}`} tabIndex={-1}>
                            Expenses
                        </Link>
                        <Link className={`btn btn-outline-secondary${incomeClass}`} to={`?${incomeParams}`} tabIndex={-1}>
                            Income
                        </Link>
                        <Link className={`btn btn-outline-secondary${transferClass}`} to={`?${transferParams}`} tabIndex={-1}>
                            Transfer
                        </Link>
                    </ButtonGroup>

                    <Link className="btn btn-outline-secondary me-2" to="/payments/import" tabIndex={-1} title="Import">
                        <i className="bi-capslock-fill"></i>
                    </Link>

                    <Link className="btn btn-secondary" to="/payments/add" tabIndex={-1}>
                        <i className="bi-plus-circle me-1"></i>
                        Add Payment
                    </Link>
                </div>
            </Col>
        </Row>
    );
}
