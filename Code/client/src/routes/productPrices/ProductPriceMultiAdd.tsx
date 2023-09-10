import { useCallback, useEffect, useState } from "react";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import requestHelper from "../../utils/requestHelper";
import LoadingPanel from "../../components/LoadingPanel";
import responseHelper from "../../utils/responseHelper";
import filterHelper from "./utils/productPriceFilterHelper";
import { ProductSelectorModel } from "../products/models/productSelectorModel";
import dateHelper from "../../utils/dateHelper";
import numberHelper from "../../utils/numberHelper";
import { useForm } from "react-hook-form";
import { ProductPriceMultiFormValues } from "./models/productPriceMultiFormValues";
import LoadingButton from "../../components/LoadingButton";
import ProductPriceMultiDetail from "./components/ProductPriceMultiDetail";
import ProductPriceMultiGrid from "./components/ProductPriceMultiGrid";

export default function ProductPriceMultiAdd() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [companies, setCompanies] = useState<string[]>();
    const [categories, setCategories] = useState<string[]>();
    const [products, setProducts] = useState<ProductSelectorModel[]>();
    const [showNoProducts, setShowNoProducts] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const cancelProductPricesUrl = filterHelper.getProductPricesUrl();

    const form = useForm<ProductPriceMultiFormValues>({
        mode: "onTouched",
        defaultValues: {
            companyName: "",
            categoryName: "",
            priceDate: dateHelper.dateToString(new Date()),
            prices: [{
                productName: "",
                quantity: "",
                price: "",
                isDiscount: false,
                description: ""
            }]
        }
    });

    const { handleSubmit } = form;

    const loadData = useCallback(async () => {
        setLoading(true);

        try {
            const selectors = await requestHelper.Selectors.getSelectors();
            const products = await requestHelper.Products.getSelectorProducts();

            setCompanies(selectors.companies);
            setCategories(selectors.categories);
            setProducts(products);
        } catch (e) {
            setError(responseHelper.getErrorMessage(e));
        }

        setLoading(false);
    }, [])

    useEffect(() => {
        loadData();
    }, [loadData])

    async function onSave(values: ProductPriceMultiFormValues) {
        const prices = values.prices.filter(p => p.productName);
        if (prices.length === 0) {
            setShowNoProducts(true);
            return;
        }

        const model = {
            companyName: values.companyName,
            categoryName: values.categoryName,
            priceDate: values.priceDate,
            prices: prices.map(p => ({
                productName: p.productName,
                quantity: p.quantity ? numberHelper.parseNumber(p.quantity) : undefined,
                price: numberHelper.parseNumber(p.price)!,
                isDiscount: p.isDiscount,
                description: p.description
            }))
        };

        setSaving(true);

        try {
            const ids = await requestHelper.ProductPrices.createProductPriceMulti(model);
            const paymentsUrl = filterHelper.getProductPricesUrl(undefined, ids[0]);

            navigate(paymentsUrl);
        } catch (e) {
            setError(responseHelper.getErrorMessage(e));
            setSaving(false);
        }
    }

    return (
        <Form noValidate onSubmit={handleSubmit(onSave, () => setShowNoProducts(false))} autoComplete="off">
            <Card className="mb-3">
                <Card.Header>
                    <Card.Title>
                        Add Multiple Product Prices
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {!loading && !error && companies && categories && (
                        <Row>
                            <Col md="6">
                                <ProductPriceMultiDetail
                                    companies={companies}
                                    categories={categories}
                                    saving={saving}
                                    form={form}
                                />
                            </Col>
                        </Row>
                    )}
                    {!loading && error && (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    )}
                    {loading && <LoadingPanel text="Initializing Screen..." />}
                </Card.Body>
            </Card>

            {!loading && !error && products && (
                <>
                    <Card className="mb-3">
                        <Card.Header>
                            <Card.Title>
                                Product Prices
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <ProductPriceMultiGrid
                                products={products}
                                saving={saving}
                                form={form}
                            />
                        </Card.Body>
                    </Card>

                    {showNoProducts && (
                        <Alert variant="danger">
                            No products added
                        </Alert>
                    )}

                    <LoadingButton
                        variant="success"
                        loading={saving}
                        text="Save Changes"
                        loadingText="Saving..."
                    />

                    <Link to={cancelProductPricesUrl} className="btn btn-secondary ms-1">
                        Cancel
                    </Link>
                </>
            )}
        </Form>
    );
}