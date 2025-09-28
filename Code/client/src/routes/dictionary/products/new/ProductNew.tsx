import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import FormSection from "@/components/form/FormSection";
import Button from "@/components/Button";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import { useNewForm } from "@/hooks/useNewForm";
import CategoryComboBox from "@/routes/_shared/CategoryComboBox";
import { comboBoxEmptyValue, ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";

interface FormValues {
    productName: string;
    categoryName: ComboBoxValue;
}

export default function ProductNew() {
    const {
        backUrl,
        isSaving,
        register,
        control,
        errors,
        handleSubmit,
    } = useNewForm(
        "Product",
        {
            productName: "",
            categoryName: comboBoxEmptyValue,
        },
        save
    );
    
    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <FormSection>
                <div className="w-[20rem]">
                    <FormField label="Product Name" required>
                        <TextInput
                            {...register("productName", {
                                required: true,
                                validate: async (name) => {
                                    return await restClient.products.exists(name, 0)
                                        ? "The product with such a name already exists"
                                        : undefined;
                                }
                            })}
                            autoFocus
                            maxLength={100}
                            readOnly={isSaving}
                            error={errors.productName}
                        />
                    </FormField>
                    <FormField label="Category">
                        <CategoryComboBox
                            control={control}
                            name="categoryName"
                            maxLength={50}
                            disabled={isSaving}
                        />
                    </FormField>
                </div>
                <div className="flex gap-1 mt-6">
                    <Button
                        variant="submit"
                        isLoading={isSaving}
                    />
                    <Button
                        variant="cancel"
                        disabled={isSaving}
                        href={backUrl}
                    />
                </div>
            </FormSection>
        </form>
    )
}

async function save(values: FormValues) {
    const id = await restClient.products.create(values.productName, values.categoryName.value);
    cache.onDictionaryChanged("products");
    return id;
}