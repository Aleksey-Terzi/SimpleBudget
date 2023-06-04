import { Button, ButtonGroup, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { PlanPaymentFilterModel } from "../models/planPaymentFilterModel";
import planPaymentFilterHelper from "../utils/planPaymentFilterHelper";

const filterHelper = planPaymentFilterHelper;

interface Props {
    filter: PlanPaymentFilterModel;
}

export default function PlanPaymentFilter({ filter }: Props) {
    const filterNoType = { ...filter, type: undefined };
    const expensesParams = filterHelper.getPlanPaymentFilterParams(filter.type === "expenses" ? filterNoType : { ...filter, type: "expenses" }, false, false) || "";
    const incomeParams = filterHelper.getPlanPaymentFilterParams(filter.type === "income" ? filterNoType : { ...filter, type: "income" }, false, false) || "";

    const expensesClass = filter.type === "expenses" ? " active" : "";
    const incomeClass = filter.type === "income" ? " active" : "";

    const navigate = useNavigate();

    function searchByText() {
        const text = (document.getElementById("FilterText") as any).value;
        const searchFilter = { ...filter, text, page: undefined };

        const filterParams = filterHelper.getPlanPaymentFilterParams(searchFilter);
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
                    </ButtonGroup>

                    <Link className="btn btn-secondary" to="/planpayments/add">
                        <i className="bi-plus-circle me-1"></i>
                        Add Plan Payment
                    </Link>
                </div>
            </Col>
        </Row>
    );
}