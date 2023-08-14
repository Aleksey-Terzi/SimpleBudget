import { useEffect, useRef, useState } from "react";
import { Alert, Card, Col, Row, Stack } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingPanel from "../../components/LoadingPanel";
import MonthSelector from "../../components/MonthSelector";
import YearSelector from "../../components/YearSelector";
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
    const yearRef = useRef<HTMLSelectElement>(null);
    const monthRef = useRef<HTMLSelectElement>(null);

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
        const year = yearRef.current!.value;
        const month = monthRef.current!.value;

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
                                <Stack direction="horizontal">
                                    Year:
                                    <YearSelector
                                        ref={yearRef}
                                        className="ms-1 me-3 w-25"
                                        defaultYear={report.selectedYear}
                                        years={report.years}
                                        allowEmpty={false}
                                        onChange={handleDateChange}
                                    />

                                    Month:
                                    <MonthSelector
                                        ref={monthRef}
                                        className="ms-1 w-25"
                                        defaultMonth={report.selectedMonth}
                                        allowEmpty={false}
                                        onChange={handleDateChange}
                                    />
                                </Stack>
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