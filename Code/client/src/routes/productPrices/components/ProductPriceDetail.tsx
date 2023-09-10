import { Form, Stack } from "react-bootstrap";
import SearchSelector from "../../../components/SearchSelector";
import { UseFormReturn } from "react-hook-form";
import validatorHelper2 from "../../../utils/validatorHelper2";
import { ProductSelectorModel } from "../../products/models/productSelectorModel";
import { ProductPriceFormValues } from "../models/productPriceFormValues";

interface Props {
    companies: string[];
    categories: string[];
    products: ProductSelectorModel[];
    saving: boolean;
    form: UseFormReturn<ProductPriceFormValues>;
}

export default function ProductPriceDetail(props: Props) {
    const { register, setValue, formState: { errors } } = props.form;

    function productName_onChange(e: any) {
        const productName = e.target.value.toLowerCase();
        const category = props.products.find(x => x.productName.toLowerCase() === productName);

        if (category?.categoryName) {
            setValue("categoryName", category.categoryName);
        }
    }

    return (
        <>
            <div className="mb-3">
                <label className="form-label">Price Date</label>
                <Form.Control
                    autoFocus={true}
                    type="date"
                    maxLength={10}
                    disabled={props.saving}
                    isInvalid={!!errors.priceDate}
                    title={errors.priceDate?.message as string}
                    className="w-25"
                    {...register("priceDate", {
                        required: "Price date is a required field"
                    })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Product</label>
                <SearchSelector
                    items={props.products?.map(p => p.productName)}
                    disabled={props.saving}
                    maxLength={100}
                    isInvalid={!!errors.productName}
                    title={errors.productName?.message as string}
                    {...register("productName", {
                        onChange: productName_onChange,
                        required: "The product is a required field"
                    })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Company</label>
                <SearchSelector
                    items={props.companies}
                    disabled={props.saving}
                    maxLength={100}
                    {...register("companyName")}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Category</label>
                <SearchSelector
                    items={props.categories}
                    disabled={props.saving}
                    maxLength={50}
                    {...register("categoryName")}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Price</label>
                <Stack direction="horizontal">
                    <Form.Control
                        type="text"
                        className="w-25"
                        maxLength={20}
                        disabled={props.saving}
                        isInvalid={!!errors.price}
                        title={errors.price?.message as string}
                        {...register("price", {
                            required: "The price is a required field",
                            validate: validatorHelper2.moneyValidator
                        })}
                    />
                    <Form.Check
                        id="isDiscount"
                        className="ms-2"
                        label="Discount"
                        disabled={props.saving}
                        {...register("isDiscount")}
                    />
                </Stack>
            </div>

            <div className="mb-3">
                <label className="form-label">Quantity</label>
                <Form.Control
                    type="text"
                    className="w-25"
                    disabled={props.saving}
                    maxLength={100}
                    isInvalid={!!errors.quantity}
                    title={errors.quantity?.message as string}
                    {...register("quantity", {
                        validate: validatorHelper2.integerValidator
                    })}
                />
            </div>

            <div>
                <label className="form-label">Description</label>
                <Form.Control
                    type="text"
                    disabled={props.saving}
                    maxLength={100}
                    {...register("description")}
                />
            </div>
        </>
    )
}