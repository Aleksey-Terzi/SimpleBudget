import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { useEditForm } from "@/hooks/useEditForm";
import FormSection from "@/components/form/FormSection";
import Button from "@/components/Button";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import CategoryComboBox from "@/routes/_shared/CategoryComboBox";
import { ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";

interface FormValues {
    productName: string;
    originalProductName: string;
    categoryName: ComboBoxValue;
    priceCount: number;
}

export default function ProductEdit() {
    const {
        id,
        backUrl,
        isLoaded,
        isSaving,
        register,
        control,
        getValues,
        errors,
        handleSubmit,
    } = useEditForm(
        "Product",
        load,
        save,
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
                                    return name !== getValues("originalProductName") && await restClient.products.exists(name, id)
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
                    <FormField label="# of Prices">
                        {getValues("priceCount")}
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
                        disabled={isSaving}
                        href={backUrl}
                    />
                </div>
            </FormSection>
        </form>
    )
}

async function load(id: number): Promise<FormValues> {
    const model = await restClient.products.get(id);
    return {
        productName: model.productName,
        originalProductName: model.productName,
        categoryName: { value: model.categoryName ?? null, type: "selected" },
        priceCount: model.priceCount
    }
}

async function save(id: number, values: FormValues) {
    await restClient.products.update(id, values.productName, values.categoryName.value);
    cache.onDictionaryChanged("products");
}