import { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import ProductPriceFilter from "./components/ProductPriceFilter";
import ProductPriceGrid from "./components/ProductPriceGrid";
import { useSearchParams } from "react-router-dom";
import filterHelper from "./utils/productPriceFilterHelper";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import { ProductPriceGridModel } from "./models/productPriceGridModel";
import { PaginationData } from "../../models/pagination";

export default function ProductPrices() {
    const [valueFormat, setValueFormat] = useState<string>();
    const [productPrices, setProductPrices] = useState<ProductPriceGridModel[]>();
    const [paginationData, setPaginationData] = useState<PaginationData>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();

    const [searchParams] = useSearchParams();
    const filter = filterHelper.getFilter(searchParams);

    useEffect(() => {
        setLoading(true);

        const searchFilter = filterHelper.getFilter(searchParams);

        requestHelper.ProductPrices.search(searchFilter)
            .then(r => {
                setValueFormat(r.valueFormat);
                setProductPrices(r.items);
                setPaginationData(r.paginationData);
                setError(undefined);
            })
            .catch(e => {
                setValueFormat(undefined);
                setProductPrices(undefined);
                setPaginationData(undefined);
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            });

    }, [searchParams, setProductPrices])

    return (
        <Card>
            <Card.Header>
                <Card.Title>Product Prices</Card.Title>
            </Card.Header>
            <Card.Body>
                <ProductPriceFilter filter={filter} loading={loading} />
                {!error ? (
                    <ProductPriceGrid
                        selectedProductPriceId={filter.id}
                        filter={filter}
                        valueFormat={valueFormat}
                        productPrices={!loading ? productPrices : undefined}
                        paginationData={paginationData}
                    />
                ) : (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
}