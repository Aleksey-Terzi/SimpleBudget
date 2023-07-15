import { useEffect, useState } from "react";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton";
import LoadingPanel from "../../components/LoadingPanel";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import TaxableIncome from "./components/TaxableIncome";
import TaxList from "./components/TaxList";
import { TaxModel } from "./models/taxModel";

export default function Tax() {
    const [model, setModel] = useState<TaxModel>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);

        let personId: number | undefined = Number(searchParams.get("personId"));
        if (isNaN(personId)) personId = undefined;

        let year: number | undefined = Number(searchParams.get("year"));
        if (isNaN(year)) year = undefined;

        requestHelper.Taxes.getTaxes(personId, year)
            .then(r => {
                setModel(r);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            });
    }, [searchParams]);

    function handleCriteriaChange() {
        const personId = (document.getElementById("personId") as any).value;
        const year = (document.getElementById("year") as any).value;

        const url = `/taxes?personId=${personId}&year=${year}`;

        navigate(url);
    }

    function handleCloseYear() {
        setSubmitting(true);

        requestHelper.Taxes.closeYear(model!.selectedPersonId, model!.selectedYear)
            .then(r => {
                setModel(r);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setSubmitting(false);
            });
    }

    function handleOpenYear() {
        setSubmitting(true);

        requestHelper.Taxes.openYear(model!.selectedPersonId, model!.selectedYear)
            .then(r => {
                setModel(r);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setSubmitting(false);
            });
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>Taxes</Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && model && (
                    <>
                        <Row className="mb-3">
                            <Col md="6">
                                <span className="me-1">Person:</span>

                                <Form.Select
                                    id="personId"
                                    className="me-3 d-inline w-25"
                                    defaultValue={model.selectedPersonId}
                                    disabled={submitting}
                                    onChange={handleCriteriaChange}
                                >
                                    {model.persons.map(person => (
                                        <option key={person.personId} value={person.personId}>
                                            {person.name}
                                        </option>
                                    ))}
                                </Form.Select>

                                <span className="me-1">Year:</span>

                                <Form.Select
                                    id="year"
                                    className="d-inline w-25"
                                    defaultValue={model.selectedYear}
                                    disabled={submitting}
                                    onChange={handleCriteriaChange}
                                >
                                    {model.years.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="8">
                                <div className="header">Taxable Income</div>
                                <TaxableIncome model={model} />
                            </Col>
                            <Col md="4">
                                <div className="header">Taxes</div>
                                <TaxList model={model} />

                                <div className="pt-4 text-end">
                                    {!model.closed && (
                                        <LoadingButton
                                            variant="danger"
                                            loading={submitting}
                                            text="Close Tax Year"
                                            loadingText="Closing Tax Year..."
                                            onClick={handleCloseYear}
                                        />
                                    )}
                                    {model.closed && model.canOpen && (
                                        <LoadingButton
                                            variant="warning"
                                            loading={submitting}
                                            text="Re-open Tax Year"
                                            loadingText="Re-opening Tax Year..."
                                            onClick={handleOpenYear}
                                        />
                                    )}
                                </div>
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