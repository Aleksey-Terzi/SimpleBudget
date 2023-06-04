import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingPanel from "../../../components/LoadingPanel";
import { CategoryGridModel } from "../models/categoryGridModel";

interface Props {
    items?: CategoryGridModel[];
    loading: boolean;
}

export default function CategoryGrid({ items, loading }: Props) {
    return (
        <>
            <Row className="mb-3">
                <Col md="6" className="text-end">
                    <Link
                        className="btn btn-secondary"
                        to="/categories/add"
                    >
                        <i className="bi-plus-circle me-1"></i>
                        Add Category
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
                                <tr key={item.categoryId}>
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
                                            to={`/categories/${item.categoryId}`}
                                        >
                                            <i className="bi-pencil"></i>
                                        </Link>
                                        <Link
                                            className="btn btn-link p-1"
                                            title="Delete"
                                            to={`/categories/${item.categoryId}/delete`}
                                        >
                                            <i className="bi-x-lg"></i>
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3}>
                                        <LoadingPanel text="Loading categories..." />
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