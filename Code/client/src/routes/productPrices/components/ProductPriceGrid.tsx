import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import GridPagination from "../../../components/GridPagination";
import LoadingPanel from "../../../components/LoadingPanel";
import { PaginationData } from "../../../models/pagination";
import { ProductPriceFilterModel } from "../models/productPriceFilterModel";
import filterHelper from "../utils/productPriceFilterHelper";
import { ProductPriceGridModel } from "../models/productPriceGridModel";
import numberHelper from "../../../utils/numberHelper";
import dateHelper from "../../../utils/dateHelper";

interface Props {
    selectedProductPriceId?: number;
    filter?: ProductPriceFilterModel;
    valueFormat?: string;
    productPrices?: ProductPriceGridModel[];
    paginationData?: PaginationData;
}

export default function ProductPriceGrid(props: Props) {
    let filterParams = filterHelper.getFilterParams(props.filter, false, false);
    filterParams = filterParams ? "&" + filterParams : "";

    return (
        <>
            <Row>
                <Col lg="12">
                    <table className="table table-striped payments">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Product</th>
                                <th>Company</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th className="text-center">Discount</th>
                                <th className="text-end">Price</th>
                                <th className="text-end">Qty</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.productPrices && props.valueFormat && (
                                props.productPrices.map(p => (
                                    <tr
                                        key={p.productPriceId}
                                        className={props.selectedProductPriceId && props.selectedProductPriceId === p.productPriceId ? "selected" : ""}
                                    >
                                        <td className="text-nowrap">
                                            {dateHelper.formatDate(p.priceDate)}
                                        </td>
                                        <td>{p.productName}</td>
                                        <td>{p.companyName}</td>
                                        <td>{p.categoryName}</td>
                                        <td>{p.description}</td>
                                        <td className="text-center">{p.isDiscount && "Yes"}</td>
                                        <td className="text-nowrap text-end">
                                            {numberHelper.formatCurrency(p.price, props.valueFormat!)}
                                        </td>
                                        <td className="text-end">
                                            {p.quantity}
                                        </td>
                                        <td className="text-nowrap text-end">
                                            <Link to={`/productprices/${p.productPriceId}`} title="Edit" className="btn btn-link p-1">
                                                <i className="bi-pencil"></i>
                                            </Link>
                                            <Link to={`/productprices/${p.productPriceId}/delete`} title="Delete" className="btn btn-link p-1">
                                                <i className="bi-x-lg"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {!props.productPrices && <LoadingPanel text="Loading Product Prices..." />}
                </Col>
            </Row>

            {props.productPrices && props.paginationData && (
                <GridPagination paginationData={props.paginationData} filterParams={filterParams} />
            )}
        </>
    );
}