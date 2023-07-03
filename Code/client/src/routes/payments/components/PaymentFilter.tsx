import { useEffect, useState } from "react";
import { Alert, Button, ButtonGroup, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "../../../components/LoadingButton";
import numberHelper from "../../../utils/numberHelper";
import requestHelper from "../../../utils/requestHelper";
import responseHelper from "../../../utils/responseHelper";
import { useAppDispatch, useAppSelector } from "../../../utils/storeHelper";
import { PaymentFilterModel } from "../models/paymentFilterModel";
import { revertCalcSum, setSum } from "../models/paymentSlice";
import paymentFilterHelper from "../utils/paymentFilterHelper";

const filterHelper = paymentFilterHelper;

interface Props {
    filter?: PaymentFilterModel;
}

export default function PaymentFilter({ filter }: Props) {
    const { calcSum, sum, sumFormat } = useAppSelector(state => state.payment);
    const dispatch = useAppDispatch();
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

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

    function searchByText() {
        const text = (document.getElementById("FilterText") as any).value;
        const searchFilter = { ...filter, text, page: undefined };

        const filterParams = filterHelper.getPaymentFilterParams(searchFilter);
        const url = "?" + (filterParams || "");

        navigate(url);
    }

    function onFilterTextKeyDown(e: any) {
        if (e.keyCode === 13) {
            searchByText();
        }
    }

    function onFilterClick() {
        searchByText();

        document.getElementById("FilterText")!.focus();
    }

    function onClearClick() {
        const filterText = document.getElementById("FilterText");

        (filterText as any).value = "";
        searchByText();

        filterText!.focus();
    }

    function onCalcSumClick() {
        dispatch(revertCalcSum());
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>
    }

    return (
        <Row className="mb-3">
            <Col lg="5">
                <Stack direction="horizontal">
                    <Form.Control
                        id="FilterText"
                        type="text"
                        className="me-1"
                        maxLength={100}
                        placeholder="Filter"
                        defaultValue={filter?.text}
                        autoComplete="off"
                        onKeyDown={onFilterTextKeyDown}
                    />
                    <Button
                        variant="link"
                        className="p-1"
                        title="Filter"
                        onClick={onFilterClick}
                    >
                        <i className="bi-search"></i>
                    </Button>
                    <Button
                        variant="link"
                        className="p-1"
                        title="Clear Filter"
                        onClick={onClearClick}
                    >
                        <i className="bi-x-lg"></i>
                    </Button>
                </Stack>
            </Col>
            <Col lg="7">
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
                            ? <>Sum: {numberHelper.formatCurrency(sumFormat, sum, "positiveAndNegative")}</>
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

                    <Link className="btn btn-secondary" to="/payments/add" tabIndex={-1}>
                        <i className="bi-plus-circle me-1"></i>
                        Add Payment
                    </Link>
                </div>
            </Col>
        </Row>
    );
}
