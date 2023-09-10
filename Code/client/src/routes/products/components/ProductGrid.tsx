import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingPanel from "../../../components/LoadingPanel";
import { ProductGridModel } from "../models/productGridModel";

interface Props {
    items?: ProductGridModel[];
    loading: boolean;
}

export default function ProductGrid({ items, loading }: Props) {
    return (
        <>
            <Row className="mb-3">
                <Col md="6">
                    <Link
                        className="btn btn-secondary"
                        to="/products/add"
                    >
                        <i className="bi-plus-circle me-1"></i>
                        Add Product
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th className="text-center">Prices</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading ? items && items.map(item => (
                                <tr key={item.productId}>
                                    <td>
                                        {item.productName}
                                    </td>
                                    <td>
                                        {item.categoryName}
                                    </td>
                                    <td className="text-center">
                                        {item.priceCount}
                                    </td>
                                    <td className="text-end">
                                        <Link
                                            className="btn btn-link p-1"
                                            title="Edit"
                                            to={`/products/${item.productId}`}
                                        >
                                            <i className="bi-pencil"></i>
                                        </Link>
                                        <Link
                                            className="btn btn-link p-1"
                                            title="Delete"
                                            to={`/products/${item.productId}/delete`}
                                        >
                                            <i className="bi-x-lg"></i>
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3}>
                                        <LoadingPanel text="Loading products..." />
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