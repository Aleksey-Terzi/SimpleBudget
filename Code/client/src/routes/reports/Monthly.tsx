import { useEffect, useState } from "react";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingPanel from "../../components/LoadingPanel";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import MonthlyCategories from "./components/MonthlyCategories";
import MonthlySummary from "./components/MonthlySummary";
import MonthlyWallets from "./components/MonthlyWallets";
import { MonthlyModel } from "./models/monthlyModel";

export default function Monthly() {
    const [report, setReport] = useState<MonthlyModel>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        setLoading(true);

        let year: number | undefined = Number(searchParams.get("year"));
        if (isNaN(year)) year = undefined;

        let month: number | undefined = Number(searchParams.get("month"));
        if (isNaN(month)) month = undefined;

        requestHelper.Reports.monthly(year, month)
            .then(r => {
                setReport(r);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            })
    }, [searchParams]);

    function handleDateChange() {
        const year = (document.getElementById("year") as any).value;
        const month = (document.getElementById("month") as any).value;

        const url = `/reports/monthly?year=${year}&month=${month}`;

        navigate(url);
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>Monthly Report</Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && report && (
                    <>
                        <Row className="mb-3">
                            <Col md="6">
                                <span className="me-1">Year:</span>

                                <Form.Select
                                    id="year"
                                    className="me-3 d-inline w-25"
                                    defaultValue={report.selectedYear}
                                    onChange={handleDateChange}
                                >
                                    {report.years.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </Form.Select>

                                <span className="me-1">Month:</span>

                                <Form.Select
                                    id="month"
                                    className="d-inline w-25"
                                    defaultValue={report.selectedMonth}
                                    onChange={handleDateChange}
                                >
                                    {report.monthNames.map((monthName, index) => (
                                        <option key={monthName} value={index + 1}>
                                            {monthName}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <div className="header">Spendings by Categories</div>
                                <MonthlyCategories report={report} />
                            </Col>
                            <Col md="6">
                                <div className="header">Spendings by Wallets</div>
                                <MonthlyWallets report={report} />

                                <div className="header">Summary</div>
                                <MonthlySummary report={report} />
                            </Col>
                        </Row>
                    </>
                )}
                {!loading && error && (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
                {loading && <LoadingPanel text="Loading Report..." />}
            </Card.Body>
        </Card>
    );
}