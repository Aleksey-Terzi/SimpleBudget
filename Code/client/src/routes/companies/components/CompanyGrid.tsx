import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingPanel from "../../../components/LoadingPanel";
import { CompanyGridModel } from "../models/companyGridModel";

interface Props {
    items?: CompanyGridModel[];
    loading: boolean;
}

export default function CompanyGrid({ items, loading }: Props) {
    return (
        <>
            <Row className="mb-3">
                <Col md="6" className="text-end">
                    <Link
                        className="btn btn-secondary"
                        to="/companies/add"
                    >
                        <i className="bi-plus-circle me-1"></i>
                        Add Company
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th className="text-center">Payments</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading ? items && items.map(item => (
                                <tr key={item.companyId}>
                                    <td>
                                        {item.name}
                                    </td>
                                    <td className="text-center">
                                        {item.paymentCount}
                                    </td>
                                    <td className="text-end">
                                        <Link
                                            className="btn btn-link p-1"
                                            title="Edit"
                                            to={`/companies/${item.companyId}`}
                                        >
                                            <i className="bi-pencil"></i>
                                        </Link>
                                        <Link
                                            className="btn btn-link p-1"
                                            title="Delete"
                                            to={`/companies/${item.companyId}/delete`}
                                        >
                                            <i className="bi-x-lg"></i>
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3}>
                                        <LoadingPanel text="Loading companies..." />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Col>
            </Row>
        </>
    );
}