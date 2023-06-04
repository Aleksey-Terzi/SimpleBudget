import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingPanel from "../../../components/LoadingPanel";
import { WalletGridModel } from "../models/walletGridModel";

interface Props {
    items?: WalletGridModel[];
    loading: boolean;
}

export default function WalletGrid({ items, loading }: Props) {
    return (
        <>
            <Row className="mb-3">
                <Col md="6" className="text-end">
                    <Link
                        className="btn btn-secondary"
                        to="/wallets/add"
                    >
                        <i className="bi-plus-circle me-1"></i>
                        Add Wallet
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Person</th>
                                <th className="text-center">Currency</th>
                                <th className="text-center">Payments</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading ? items && items.map(item => (
                                <tr key={item.walletId}>
                                    <td>
                                        {item.walletName}
                                    </td>
                                    <td>
                                        {item.personName}
                                    </td>
                                    <td className="text-center">
                                        {item.currencyCode}
                                    </td>
                                    <td className="text-center">
                                        {item.paymentCount}
                                    </td>
                                    <td className="text-end">
                                        <Link
                                            className="btn btn-link p-1"
                                            title="Edit"
                                            to={`/wallets/${item.walletId}`}
                                        >
                                            <i className="bi-pencil"></i>
                                        </Link>
                                        <Link
                                            className="btn btn-link p-1"
                                            title="Delete"
                                            to={`/wallets/${item.walletId}/delete`}
                                        >
                                            <i className="bi-x-lg"></i>
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3}>
                                        <LoadingPanel text="Loading wallets..." />
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