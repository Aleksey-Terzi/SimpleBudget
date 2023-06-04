import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import GridPagination from "../../../components/GridPagination";
import LoadingPanel from "../../../components/LoadingPanel";
import { PaginationData } from "../../../models/pagination";
import planPaymentFilterHelper from "../utils/planPaymentFilterHelper";
import reportFormatHelper from "../../../utils/reportFormatHelper";
import { PlanPaymentGridItemModel } from "../models/planPaymentGridItemModel";
import { PlanPaymentFilterModel } from "../models/planPaymentFilterModel";

const filterHelper = planPaymentFilterHelper;

interface Props {
    selectedPlanPaymentId?: number;
    filter?: PlanPaymentFilterModel;
    planPayments?: PlanPaymentGridItemModel[];
    paginationData?: PaginationData;
}

export default function PlanPaymentGrid({ selectedPlanPaymentId, filter, planPayments, paginationData }: Props) {
    let filterParams = filterHelper.getPlanPaymentFilterParams(filter, false, false);
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
                                <th>Date Range</th>
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
                            {planPayments && (
                                planPayments.map(p => (
                                    <tr key={p.planPaymentId} className={selectedPlanPaymentId && selectedPlanPaymentId === p.planPaymentId ? "selected" : ""}>
                                        <td className="text-nowarp">
                                            {p.formattedPaymentDateRange}
                                            <small className="ms-1">#{p.planPaymentId}</small>

                                            <div>
                                                <small>
                                                    {p.isActiveAndInDate
                                                        ? <b>Active</b>
                                                        : <>Inactive</>
                                                    }
                                                </small>
                                            </div>
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
                                        </td>
                                        <td>
                                            {p.personName}
                                        </td>
                                        <td className="text-nowrap text-end">
                                            {reportFormatHelper.formatValueMarkIncome(p.value, p.formattedValue)}
                                        </td>
                                        <td className="text-center">
                                            {p.taxable && (
                                                <i className="bi-receipt" style={{ color: "orange" }} title="Taxable"></i>
                                            )}
                                        </td>
                                        <td className="text-nowrap text-end">
                                            <Link to={`/planpayments/${p.planPaymentId}`} title="Edit" className="btn btn-link p-1">
                                                <i className="bi-pencil"></i>
                                            </Link>
                                            <Link to={`/planpayments/${p.planPaymentId}/delete`} title="Delete" className="btn btn-link p-1">
                                                <i className="bi-x-lg"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {!planPayments && <LoadingPanel text="Loading Payments..." />}
                </Col>
            </Row>

            {planPayments && paginationData && (
                <GridPagination paginationData={paginationData} filterParams={filterParams} />
            )}
        </>
    );
}