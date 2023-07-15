import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingPanel from "../../../components/LoadingPanel";
import numberHelper from "../../../utils/numberHelper";
import { TaxSettingGridModel } from "../models/taxSettingModel";

interface Props {
    valueFormat?: string;
    items?: TaxSettingGridModel[];
    loading: boolean;
}

export default function TaxSettingGrid({ valueFormat, items, loading }: Props) {
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
                            {!loading && valueFormat && items && items.map(item => (
                                <tr key={item.year}>
                                    <td>
                                        {item.year}
                                    </td>
                                    <td className="text-end">{item.cppRate && numberHelper.formatPercent(item.cppRate)}</td>
                                    <td className="text-end">{item.cppMaxAmount && numberHelper.formatCurrency(item.cppMaxAmount, valueFormat)}</td>
                                    <td className="text-end">{item.eiRate && numberHelper.formatPercent(item.eiRate)}</td>
                                    <td className="text-end">{item.eiMaxAmount && numberHelper.formatCurrency(item.eiMaxAmount, valueFormat)}</td>
                                    <td className="text-end">{item.cppBasicExemptionAmount && numberHelper.formatCurrency(item.cppBasicExemptionAmount, valueFormat)}</td>
                                    <td className="text-end">{item.federalBasicPersonalAmount && numberHelper.formatCurrency(item.federalBasicPersonalAmount, valueFormat)}</td>
                                    <td className="text-end">{item.provincialBasicPersonalAmount && numberHelper.formatCurrency(item.provincialBasicPersonalAmount, valueFormat)}</td>
                                    <td className="text-end">{item.canadaEmploymentBaseAmount && numberHelper.formatCurrency(item.canadaEmploymentBaseAmount, valueFormat)}</td>
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