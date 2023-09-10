import { Form } from "react-bootstrap";
import SearchSelector from "../../../components/SearchSelector";
import { UseFormReturn } from "react-hook-form";
import { ProductPriceMultiFormValues } from "../models/productPriceMultiFormValues";

interface Props {
    companies: string[];
    categories: string[];
    saving: boolean;
    form: UseFormReturn<ProductPriceMultiFormValues>;
}

export default function ProductPriceDetail(props: Props) {
    const { register, formState: { errors } } = props.form;

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
        </>
    )
}