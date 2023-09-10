import { useCallback, useEffect, useState } from "react";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteLink from "../../components/DeleteLink";
import LoadingButton from "../../components/LoadingButton";
import LoadingPanel from "../../components/LoadingPanel";
import paramHelper from "../../utils/paramHelper";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import ProductDetail from "./components/ProductDetail";
import { ProductFormValues } from "./models/productFormValues";

export default function ProductEdit() {
    const idText = useParams<{ id: string }>().id;
    const { id, action } = paramHelper.getEditorModel(idText);
    const [priceCount, setPriceCount] = useState<number>(0);
    const [categories, setCategories] = useState<string[]>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const form = useForm<ProductFormValues>({
        mode: "onTouched",
        defaultValues: {
            productName: "",
            categoryName: ""
        }
    });

    const { handleSubmit, setValue } = form;

    const loadData = useCallback(async () => {
        setLoading(true);

        try {
            if (action === "edit") {
                const model = await requestHelper.Products.getProduct(id!);

                setValue("productName", model.productName);
                setValue("categoryName", model.categoryName || "");
                setPriceCount(model.priceCount);
            }

            const loadedCategories = await requestHelper.Categories.getSelectorCategories();
            setCategories(loadedCategories);
        } catch (e) {
            setError(responseHelper.getErrorMessage(e));
        }
        finally {
            setLoading(false);
        }
    }, [action, id, setValue]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    function onSave(values: ProductFormValues) {
        const model = {
            productName: values.productName,
            categoryName: values.categoryName,
            priceCount: 0
        };

        setSaving(true);

        const promise = id
            ? requestHelper.Products.updateProduct(id, model)
            : requestHelper.Products.createProduct(model);

        promise
            .then(() => {
                navigate("/products");
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
                setSaving(false);
            });
    }

    return (
        <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSave)}>
            <Card className="mb-3">
                <Card.Header>
                    <Card.Title>
                        {action === "edit" ? (
                            <>Edit Product</>
                        ) : (
                            <>Add Product</>
                        )}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {!loading && !error && categories && (
                        <Row>
                            <Col md="6">
                                <ProductDetail
                                    id={id}
                                    action={action}
                                    categories={categories}
                                    saving={saving}
                                    form={form}
                                    priceCount={priceCount}
                                />
                            </Col>
                        </Row>
                    )}
                    {!loading && error && (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    )}
                    {loading && <LoadingPanel text="Loading product..." />}
                </Card.Body>
            </Card>
            {!loading && !error && (
                <>
                    <LoadingButton
                        variant="success"
                        text="Save Changes"
                        loadingText="Saving Changes..."
                        loading={saving}
                    />
                    <Link
                        className="btn btn-secondary ms-1"
                        to="/products"
                    >
                        Cancel
                    </Link>
                    {action === "edit" && (
                        <DeleteLink
                            to={`/products/${id}/delete`}
                            className="ms-1"
                            disabled={saving}
                        />
                    )}
                </>
            )}
        </Form>
    );
}