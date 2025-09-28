import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import FormSection from "@/components/form/FormSection";
import Button from "@/components/Button";
import { useNewForm } from "@/hooks/useNewForm";
import { CurrencyEditModel } from "@/api/models/CurrencyEditModel";
import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";

interface FormValues {
    code: string | null;
    format: string | null;
}

export default function CurrencyNew() {
    const {
        backUrl,
        isSaving,
        register,
        errors,
        handleSubmit,
    } = useNewForm(

        "Currency",

        {
            code: "",
            format: "",
        },
        
        async (values: FormValues) => {
            const apiModel: CurrencyEditModel = {
                code: values.code!,
                valueFormat: values.format!,
                walletCount: 0,
            };
            const id = await restClient.currencies.create(apiModel);
            
            cache.onDictionaryChanged("currencies");

            return id;
        },

        "/dictionary/currencies/"
    );

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <FormSection>
                <div className="w-[20rem]">
                    <FormField label="Code">
                        <TextInput
                            {...register("code", {
                                required: true,
                                validate: async (code) => {
                                    return await restClient.currencies.exists(code, null)
                                        ? "The currency with such a code already exists"
                                        : undefined;
                                }
                            })}
                            autoFocus
                            maxLength={10}
                            readOnly={isSaving}
                            error={errors.code}
                        />
                    </FormField>
                    <FormField label="Format">
                        <TextInput
                            {...register("format", {
                                required: true
                            })}
                            maxLength={50}
                            readOnly={isSaving}
                            error={errors.format}
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
                        href={backUrl}
                    />
                </div>
            </FormSection>
        </form>
    );
}