import { useCallback, useEffect, useState } from "react";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import paramHelper from "../../utils/paramHelper";
import requestHelper from "../../utils/requestHelper";
import ProductPriceDetail from "./components/ProductPriceDetail";
import LoadingPanel from "../../components/LoadingPanel";
import responseHelper from "../../utils/responseHelper";
import filterHelper from "./utils/productPriceFilterHelper";
import { ProductSelectorModel } from "../products/models/productSelectorModel";
import dateHelper from "../../utils/dateHelper";
import numberHelper from "../../utils/numberHelper";
import { useForm } from "react-hook-form";
import { ProductPriceFormValues } from "./models/productPriceFormValues";
import LoadingButton from "../../components/LoadingButton";
import DeleteLink from "../../components/DeleteLink";

export default function ProductPriceEdit() {
    const idText = useParams<{ id: string }>().id;
    const { id, action } = paramHelper.getEditorModel(idText);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [companies, setCompanies] = useState<string[]>();
    const [categories, setCategories] = useState<string[]>();
    const [products, setProducts] = useState<ProductSelectorModel[]>();
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const cancelProductPricesUrl = filterHelper.getProductPricesUrl(undefined, id);

    const form = useForm<ProductPriceFormValues>({
        mode: "onTouched",
        defaultValues: {
            productName: "",
            companyName: "",
            categoryName: "",
            priceDate: dateHelper.dateToString(new Date()),
            price: "",
            isDiscount: false,
            quantity: "",
            description: ""
        }
    });

    const { handleSubmit, setValue } = form;

    const loadData = useCallback(async () => {
        setLoading(true);

        try {
            const model = id ? await requestHelper.ProductPrices.getProductPrice(id) : undefined;
            const selectors = await requestHelper.Selectors.getSelectors();
            const products = await requestHelper.Products.getSelectorProducts();

            setCompanies(selectors.companies);
            setCategories(selectors.categories);
            setProducts(products);

            if (model) {
                setValue("productName", model.productName);
                setValue("companyName", model.companyName || "");
                setValue("categoryName", model.categoryName || "");
                setValue("priceDate", model.priceDate || dateHelper.dateToString(new Date()));
                setValue("price", numberHelper.formatNumber(model.price)!);
                setValue("isDiscount", model.isDiscount);
                setValue("quantity", model.quantity ? String(model.quantity) : "");
                setValue("description", model.description || "");
            }
        } catch (e) {
            setError(responseHelper.getErrorMessage(e));
        }

        setLoading(false);
    }, [id, setValue])

    useEffect(() => {
        loadData();
    }, [loadData])

    function onSave(values: ProductPriceFormValues) {
        const model = {
            productName: values.productName,
            companyName: values.companyName,
            categoryName: values.categoryName,
            priceDate: values.priceDate,
            price: numberHelper.parseNumber(values.price)!,
            isDiscount: values.isDiscount,
            quantity: values.quantity ? Number(values.quantity) : undefined,
            description: values.description
        };

        setSaving(true);

        if (id) {
            requestHelper.ProductPrices.updateProductPrice(id, model)
                .then(() => {
                    navigate(cancelProductPricesUrl);
                })
                .catch(e => {
                    setError(responseHelper.getErrorMessage(e));
                    setSaving(false);
                });
        } else {
            requestHelper.ProductPrices.createProductPrice(model)
                .then(r => {
                    const paymentsUrl = filterHelper.getProductPricesUrl(undefined, r);

                    navigate(paymentsUrl);
                })
                .catch(e => {
                    setError(responseHelper.getErrorMessage(e));
                    setSaving(false);
                });
        }
    }

    return (
        <Form noValidate onSubmit={handleSubmit(onSave)} autoComplete="off">
            <Card className="mb-3">
                <Card.Header>
                    <Card.Title>
                        {action === "edit" ? (
                            <>Edit Product Price</>
                        ) : (
                            <>Add Product Price</>
                        )}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {!loading && !error && (
                        <Row>
                            <Col md="6">
                                <ProductPriceDetail
                                    products={products!}
                                    companies={companies!}
                                    categories={categories!}
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

            {!loading && !error && (
                <>
                    <LoadingButton
                        variant="success"
                        loading={saving}
                        text="Save Changes"
                        loadingText="Saving..."
                    />

                    <Link to={cancelProductPricesUrl} className="btn btn-secondary ms-1">
                        Cancel
                    </Link>

                    {id && (
                        <DeleteLink
                            className="ms-1"
                            to={`/productsprices/${id}/delete`}
                            disabled={saving}
                        />
                    )}
                </>
            )}
        </Form>
    );
}