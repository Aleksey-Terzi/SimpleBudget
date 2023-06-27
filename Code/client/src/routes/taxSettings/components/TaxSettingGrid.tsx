import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingPanel from "../../../components/LoadingPanel";
import { TaxSettingGridModel } from "../models/taxSettingGridModel";

interface Props {
    items?: TaxSettingGridModel[];
    loading: boolean;
}

export default function TaxSettingGrid({ items, loading }: Props) {
    const currentYear = new Date().getFullYear();
    var hasCurrentYearSettings = !!items?.find(x => x.year === currentYear);

    return (
        <>
            <Row className="mb-3">
                <Col md="12" className="text-end">
                    {items && !hasCurrentYearSettings && (
                        <Link
                            className="btn btn-secondary"
                            to={`/taxsettings/${currentYear}?from=${currentYear - 1}`}
                        >
                            <i className="bi-plus-circle me-1"></i>
                            Add Settings for {currentYear}
                        </Link>
                    )}
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th className="text-end">CPP Rate</th>
                                <th className="text-end">CPP Max</th>
                                <th className="text-end">EI Rate</th>
                                <th className="text-end">EI Max</th>
                                <th className="text-end">CPP Basic Exemp.</th>
                                <th className="text-end">Fed. Basic Personal</th>
                                <th className="text-end">Prov. Basic Personal Amount</th>
                                <th className="text-end">Canada Employment Base Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && items && items.map(item => (
                                <tr key={item.year}>
                                    <td>
                                        {item.year}
                                    </td>
                                    <td className="text-end">{item.cppRateFormatted}</td>
                                    <td className="text-end">{item.cppMaxAmountFormatted}</td>
                                    <td className="text-end">{item.eiRateFormatted}</td>
                                    <td className="text-end">{item.eiMaxAmountFormatted}</td>
                                    <td className="text-end">{item.cppBasicExemptionAmountFormatted}</td>
                                    <td className="text-end">{item.federalBasicPersonalAmountFormatted}</td>
                                    <td className="text-end">{item.provincialBasicPersonalAmountFormatted}</td>
                                    <td className="text-end">{item.canadaEmploymentBaseAmountFormatted}</td>
                                    <td className="text-end">
                                        <Link
                                            className="btn btn-link p-1"
                                            title="Edit"
                                            to={`/taxsettings/${item.year}`}
                                        >
                                            <i className="bi-pencil"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <LoadingPanel text="Loading tax settings..." />}
                </Col>
            </Row>
        </>
    );
}