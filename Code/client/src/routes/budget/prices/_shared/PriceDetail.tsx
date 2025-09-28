import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { PriceDetailValues } from "../_models/PriceDetailValues";
import FormField from "@/components/form/FormField";
import ProductComboBox from "@/routes/_shared/ProductComboBox";
import CompanyComboBox from "@/routes/_shared/CompanyComboBox";
import CategoryComboBox from "@/routes/_shared/CategoryComboBox";
import CheckInput from "@/components/inputs/CheckInput";
import TextInput from "@/components/inputs/TextInput";
import ControlledDateInput from "@/components/inputs/dateinput/ControlledDateInput";
import ControlledDecimalInput from "@/components/inputs/numeric/ControlledDecimalInput";
import ControlledIntegerInput from "@/components/inputs/numeric/ControlledIntegerInput";
import FormSection from "@/components/form/FormSection";
import Button from "@/components/Button";

interface Props {
    isLoaded: boolean,
    isSaving: boolean,
    backUrl: string;
    register: UseFormRegister<PriceDetailValues>,
    control: Control<PriceDetailValues>,
    errors: FieldErrors<PriceDetailValues>,
}

export default function PriceDetails({
    isLoaded,
    isSaving,
    backUrl,
    register,
    control,
    errors,
}: Props) {
    const isDisabled = !isLoaded || isSaving;

    return (
        <FormSection>
            <div className="max-w-[36rem]">
                <FormField label="Price Date" className="max-w-40" required>
                    <ControlledDateInput
                        control={control}
                        name="priceDate"
                        required={true}
                        placeholder="MM/dd/yyyy"
                        readOnly={isDisabled}
                    />
                </FormField>

                <FormField label="Product" required>
                    <ProductComboBox
                        control={control}
                        name="productName"
                        required={true}
                        maxLength={100}
                        disabled={isDisabled}
                    />
                </FormField>

                <FormField label="Company">
                    <CompanyComboBox
                        control={control}
                        name="companyName"
                        maxLength={100}
                        disabled={isDisabled}
                    />
                </FormField>

                <FormField label="Category">
                    <CategoryComboBox
                        control={control}
                        name="categoryName"
                        maxLength={50}
                        disabled={isDisabled}
                    />
                </FormField>

                <FormField label="Price Per Unit" required>
                    <div className="flex gap-3">
                        <ControlledDecimalInput
                            control={control}
                            name="price"
                            required
                            min={100}
                            className="max-w-40"
                            readOnly={isDisabled}
                        />
                        <CheckInput
                            {...register("isDiscount")}
                            disabled={isDisabled}
                        >
                            Taxable
                        </CheckInput>
                    </div>
                </FormField>

                <FormField label="Quantity">
                    <ControlledIntegerInput
                        control={control}
                        name="quantity"
                        min={1}
                        className="max-w-40"
                        readOnly={isDisabled}
                    />
                </FormField>

                <FormField label="Description">
                    <TextInput
                        {...register("description")}
                        maxLength={100}
                        readOnly={isDisabled}
                        error={errors.description}
                    />
                </FormField>
            </div>
            <div className="flex gap-1 mt-6">
                 <Button
                     variant="submit"
                     disabled={!isLoaded}
                     isLoading={isSaving}
                 />
                 <Button
                     variant="cancel"
                     disabled={isDisabled}
                     href={backUrl}
                 />
             </div>
         </FormSection>
    );
}