import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { useEditForm } from "@/hooks/useEditForm";
import FormSection from "@/components/form/FormSection";
import Button from "@/components/Button";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";

interface FormValues {
    name: string;
    originalName: string;
    paymentCount: number;
}

export default function CategoryEdit() {
    const {
        id,
        backUrl,
        isLoaded,
        isSaving,
        register,
        getValues,
        errors,
        handleSubmit,
    } = useEditForm(
        "Category",
        load,
        save,
    );
    
    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <FormSection>
                <div className="w-[20rem]">
                    <FormField label="Name" required>
                        <TextInput
                            {...register("name", {
                                required: true,
                                validate: async (name) => {
                                    return name !== getValues("originalName") && await restClient.categories.exists(name, id)
                                        ? "The category with such a name already exists"
                                        : undefined;
                                }
                            })}
                            autoFocus
                            maxLength={50}
                            readOnly={!isLoaded || isSaving}
                            error={errors.name}
                        />
                    </FormField>
                    <FormField label="# of Payments">
                        {getValues("paymentCount")}
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
    const model = await restClient.categories.get(id);
    return {
        name: model.name,
        originalName: model.name,
        paymentCount: model.paymentCount
    }
}

async function save(id: number, values: FormValues) {
    await restClient.categories.update(id, values.name);
    cache.onDictionaryChanged("categories");
}