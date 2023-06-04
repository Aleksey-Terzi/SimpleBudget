import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import GridPagination from "../../../components/GridPagination";
import LoadingPanel from "../../../components/LoadingPanel";
import { PaginationData } from "../../../models/pagination";
import { PaymentFilterModel } from "../models/paymentFilterModel";
import paymentFilterHelper from "../utils/paymentFilterHelper";
import reportFormatHelper from "../../../utils/reportFormatHelper";
import { PaymentGridItemModel } from "../models/paymentGridItemModel";

const filterHelper = paymentFilterHelper;

interface Props {
    selectedPaymentId?: number;
    filter?: PaymentFilterModel;
    payments?: PaymentGridItemModel[];
    paginationData?: PaginationData;
}

export default function PaymentGrid({ selectedPaymentId, filter, payments, paginationData }: Props) {
    let filterParams = filterHelper.getPaymentFilterParams(filter, false, false);
    if (filterParams) {
        filterParams = "&" + filterParams;
    } else {
        filterParams = "";
    }

    return (
        <>
            <Row>
                <Col lg="12">
                    <table className="table table-striped payments">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Company</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Wallet</th>
                                <th>Person</th>
                                <th className="text-end">Value</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments && (
                                payments.map(p => (
                                    <tr key={p.paymentId} className={selectedPaymentId && selectedPaymentId === p.paymentId ? "selected" : ""}>
                                        <td className="text-nowarp">
                                            {p.formattedPaymentDate}
                                            {p.transferTo
                                                ? <small className="ms-1">#{p.paymentId} / {p.transferTo.paymentId}</small>
                                                : <small className="ms-1">#{p.paymentId}</small>
                                            }
                                        </td>
                                        <td>{p.companyName}</td>
                                        <td>{p.description}</td>
                                        <td>
                                            {p.categoryName}
                                            {p.taxYear && (
                                                <div><small>Tax Year: {p.taxYear}</small></div>
                                            )}
                                        </td>
                                        <td>
                                            {p.walletName}
                                            {p.transferTo && (
                                                <div><small>{p.transferTo.walletName}</small></div>
                                            )}
                                        </td>
                                        <td>
                                            {p.personName}
                                        </td>
                                        <td className="text-nowrap text-end">
                                            {reportFormatHelper.formatValueMarkIncome(p.value, p.formattedValue)}

                                            {p.transferTo && p.value !== -p.transferTo.value && (
                                                <div><small>{p.transferTo.formattedValue}</small></div>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {p.transferTo && (
                                                <i className="bi-arrow-left-right" title="Transfer"></i>
                                            )}
                                            {p.taxable && (
                                                <i className="bi-receipt" style={{ color: "orange" }} title="Taxable"></i>
                                            )}
                                        </td>
                                        <td className="text-nowrap text-end">
                                            <Link to={`/payments/${p.paymentId}`} title="Edit" className="btn btn-link p-1">
                                                <i className="bi-pencil"></i>
                                            </Link>
                                            <Link to={`/payments/${p.paymentId}/delete`} title="Delete" className="btn btn-link p-1">
                                                <i className="bi-x-lg"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {!payments && <LoadingPanel text="Loading Payments..." />}
                </Col>
            </Row>

            {payments && paginationData && (
                <GridPagination paginationData={paginationData} filterParams={filterParams} />
            )}
        </>
    );
}