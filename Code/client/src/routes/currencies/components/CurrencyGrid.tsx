import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingPanel from "../../../components/LoadingPanel";
import dateHelper from "../../../utils/dateHelper";
import { CurrencyGridModel } from "../models/currencyGridModel";

interface Props {
    items?: CurrencyGridModel[];
    loading: boolean;
}

export default function CurrencyGrid({ items, loading }: Props) {
    return (
        <>
            <Row className="mb-3">
                <Col md="6" className="text-end">
                    <Link
                        className="btn btn-secondary"
                        to="/currencies/add"
                    >
                        <i className="bi-plus-circle me-1"></i>
                        Add Currency
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Value Format</th>
                                <th className="text-end">Market Rate</th>
                                <th className="text-end">Bank Rate</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && items && items.map(item => (
                                <tr key={item.currencyId}>
                                    <td>
                                        {item.code}
                                    </td>
                                    <td>
                                        {item.valueFormat}
                                    </td>
                                    <td className="text-end">
                                        {(item.marketRate || 1).toFixed(4)}
                                        <div className="form-text">
                                            {item.marketStartDate && dateHelper.formatDate(item.marketStartDate)}
                                        </div>
                                    </td>
                                    <td className="text-end">
                                        {(item.bankRate || 1).toFixed(4)}
                                        <div className="form-text">
                                            {item.bankStartDate && dateHelper.formatDate(item.bankStartDate)}
                                        </div>
                                    </td>
                                    <td className="text-end">
                                        <Link
                                            className="btn btn-link p-1"
                                            title="Edit"
                                            to={`/currencies/${item.currencyId}`}
                                        >
                                            <i className="bi-pencil"></i>
                                        </Link>
                                        <Link
                                            className="btn btn-link p-1"
                                            title="Delete"
                                            to={`/currencies/${item.currencyId}/delete`}
                                        >
                                            <i className="bi-x-lg"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <LoadingPanel text="Loading currencies..." />}
                </Col>
            </Row>
        </>
    );
}