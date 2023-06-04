import { Button, ButtonGroup, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { PaymentFilterModel } from "../models/paymentFilterModel";
import paymentFilterHelper from "../utils/paymentFilterHelper";

const filterHelper = paymentFilterHelper;

interface Props {
    filter: PaymentFilterModel;
}

export default function PaymentFilter({ filter }: Props) {
    const filterNoType = { ...filter, type: undefined };
    const expensesParams = filterHelper.getPaymentFilterParams(filter.type === "expenses" ? filterNoType : { ...filter, type: "expenses" }, false, false) || "";
    const incomeParams = filterHelper.getPaymentFilterParams(filter.type === "income" ? filterNoType : { ...filter, type: "income" }, false, false) || "";
    const transferParams = filterHelper.getPaymentFilterParams(filter.type === "transfer" ? filterNoType : { ...filter, type: "transfer" }, false, false) || "";

    const expensesClass = filter.type === "expenses" ? " active" : "";
    const incomeClass = filter.type === "income" ? " active" : "";
    const transferClass = filter.type === "transfer" ? " active" : "";

    const navigate = useNavigate();

    function searchByText() {
        const text = (document.getElementById("FilterText") as any).value;
        const searchFilter = { ...filter, text, page: undefined };

        const filterParams = filterHelper.getPaymentFilterParams(searchFilter);
        const url = "?" + (filterParams || "");

        navigate(url);
    }

    function handleFilterTextKeyDown(e: any) {
        if (e.keyCode === 13) {
            searchByText();
        }
    }

    function handleFilterClick() {
        searchByText();

        document.getElementById("FilterText")!.focus();
    }

    function handleClearClick() {
        const filterText = document.getElementById("FilterText");

        (filterText as any).value = "";
        searchByText();

        filterText!.focus();
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
                        defaultValue={filter.text}
                        autoComplete="off"
                        onKeyDown={handleFilterTextKeyDown}
                    />
                    <Button
                        variant="link"
                        className="p-1"
                        title="Filter"
                        onClick={handleFilterClick}
                    >
                        <i className="bi-search"></i>
                    </Button>
                    <Button
                        variant="link"
                        className="p-1"
                        title="Clear Filter"
                        onClick={handleClearClick}
                    >
                        <i className="bi-x-lg"></i>
                    </Button>
                </Stack>
            </Col>
            <Col lg="7">
                <div className="float-end pb-3">
                    <ButtonGroup className="pe-2">
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

                    <Link className="btn btn-secondary" to="/payments/add">
                        <i className="bi-plus-circle me-1"></i>
                        Add Payment
                    </Link>
                </div>
            </Col>
        </Row>
    );
}