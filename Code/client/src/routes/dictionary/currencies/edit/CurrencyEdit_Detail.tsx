import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CurrencyEditValues } from "./CurrencyEditValues";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import { restClient } from "@/api/restClient";
import FormTitle from "@/components/form/FormTitle";

interface Props {
    currencyId: number;
    originalCode?: string | null;
    isLoaded: boolean;
    isSaving: boolean;
    register: UseFormRegister<CurrencyEditValues>,
    errors: FieldErrors<CurrencyEditValues>,
}

export default function CurrencyEdit_Detail({
    currencyId,
    originalCode,
    isLoaded,
    isSaving,
    register,
    errors,
}: Props) {
    return (
        <div className="w-[20rem]">
            <FormTitle>Edit Currency</FormTitle>

            <FormField label="Code">
                <TextInput
                    {...register("code", {
                        required: true,
                        validate: async (code) => {
                            return code !== originalCode && await restClient.currencies.exists(code!, currencyId)
                                ? "The currency with such a code already exists"
                                : undefined;
                        }
                    })}
                    autoFocus
                    maxLength={10}
                    readOnly={!isLoaded || isSaving}
                    error={errors.code}
                />
            </FormField>
            <FormField label="Format">
                <TextInput
                    {...register("format", {
                        required: true
                    })}
                    maxLength={50}
                    readOnly={!isLoaded || isSaving}
                    error={errors.format}
                />
            </FormField>
        </div>
    );
}