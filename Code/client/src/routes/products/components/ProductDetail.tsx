import { Form } from "react-bootstrap";
import requestHelper from "../../../utils/requestHelper";
import { UseFormReturn } from "react-hook-form";
import SearchSelector from "../../../components/SearchSelector";
import { ProductFormValues } from "../models/productFormValues";

interface Props {
    id?: number;
    action: string;
    categories: string[];
    saving: boolean;
    form: UseFormReturn<ProductFormValues>,
    priceCount: number
}

export default function ProductDetail(props: Props) {
    const uniqueNameValidator = async (name: string) => {
        const exists = await requestHelper.Products.productExists(name, props.id);
        return exists ? "The product with such a name already exists" : undefined;
    }

    const { register, formState: { errors } } = props.form;

    return (
        <>
            <div className="mb-3">
                <label className="form-label">Product Name</label>
                <Form.Control
                    autoFocus={true}
                    type="text"
                    maxLength={100}
                    disabled={props.saving}
                    isInvalid={!!errors.productName}
                    title={errors.productName?.message as string}
                    {...register("productName", {
                        required: "Product name is a required field",
                        validate: uniqueNameValidator
                    })}
                />
            </div>
            <div>
                <label className="form-label">Category</label>
                <SearchSelector
                    items={props.categories}
                    disabled={props.saving}
                    maxLength={50}
                    {...register("categoryName")}
                />
            </div>
            {props.action === "edit" && (
                <div className="mt-3">
                    <label className="form-label"># of Prices</label>
                    <div>
                        {props.priceCount}
                    </div>
                </div>
            )}
        </>
    );
}