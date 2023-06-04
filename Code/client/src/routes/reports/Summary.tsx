import { useEffect, useState } from "react";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingPanel from "../../components/LoadingPanel";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import { SummaryModel } from "./models/summaryModel";
import reportFormatHelper from "../../utils/reportFormatHelper";

export default function Summary() {
    const [report, setReport] = useState<SummaryModel>();
    const [error, setError] = useState<string | undefined>();
    const [searchParams] = useSearchParams();
    const deductTaxes = searchParams.get("deduct") !== "0";
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const formatValue = reportFormatHelper.formatValue;

    useEffect(() => {
        setLoading(true);

        requestHelper.Reports.summary()
            .then(r => {
                setReport(r);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            })
    }, []);

    let total: JSX.Element | undefined;

    if (report) {
        const totalValue = report.wallets.reduce((a, b) => a + b.valueCAD, 0);

        if (deductTaxes) {
            const formattedTotal = formatValue(totalValue, report.formattedTotalValue);
            const formattedDiff = formatValue(totalValue - report.taxCAD, report.formattedTotalTaxDifference);

            total = <strong>{formattedTotal} - {report.formattedTax} = {formattedDiff}</strong>;
        } else {
            total = <strong>{formatValue(totalValue, report.formattedTotalValue)}</strong>;
        }
    }

    function handleDeductTaxesChanged(e: any) {
        const p = e.target.checked ? "": "?deduct=0";
        navigate("/reports/summary" + p);
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>Summary</Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && report && (
                    <>
                        <Row>
                            <Col md="7">
                                <div className="header">Wallets</div>

                                <table className="table table-striped wallets">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th className="text-center">Currency</th>
                                            <th className="text-end">Value</th>
                                            <th className="text-end">Rate</th>
                                            <th className="text-end">Value (CAD)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.wallets.map(item => (
                                            <tr key={item.walletName}>
                                                <td>{item.walletName}</td>
                                                <td className="text-center">{item.currencyCode}</td>
                                                <td className="text-end">{formatValue(item.valueCAD, item.formattedValue)}</td>
                                                <td className="text-end">{item.formattedRate}</td>
                                                <td className="text-end">{formatValue(item.valueCAD, item.formattedValueCAD)}</td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <td colSpan={5} className="text-end">{total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                            <Col md="5">
                                <div className="header">Currencies</div>

                                <table className="table table-striped currencies">
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th className="text-end">Value</th>
                                            <th className="text-end">Rate</th>
                                            <th className="text-end">Value (CAD)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.currencies.map(item => (
                                            <tr key={item.currencyCode}>
                                                <td>{item.currencyCode}</td>
                                                <td className="text-end">{formatValue(item.valueCAD, item.formattedValue)}</td>
                                                <td className="text-end">{item.formattedRate}</td>
                                                <td className="text-end">{formatValue(item.valueCAD, item.formattedValueCAD)}</td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <td colSpan={4} className="text-end">{total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Form.Check
                                    id="deductTaxes"
                                    label="Deduct unpaid taxes"
                                    defaultChecked={deductTaxes}
                                    onChange={handleDeductTaxesChanged}
                                />
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