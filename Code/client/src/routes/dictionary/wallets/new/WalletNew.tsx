import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import FormSection from "@/components/form/FormSection";
import Button from "@/components/Button";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import { useNewForm } from "@/hooks/useNewForm";
import { comboBoxEmptyValue, ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";
import WalletPersonComboBox from "@/routes/_shared/WalletPersonComboBox";
import WalletCurrencyComboBox from "@/routes/_shared/WalletCurrencyComboBox";

interface FormValues {
    walletName: string;
    personId: ComboBoxValue;
    currencyId: ComboBoxValue;
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
        "Wallet",
        {
            walletName: "",
            personId: comboBoxEmptyValue,
            currencyId: comboBoxEmptyValue,
        },
        save
    );
    
    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <FormSection>
                <div className="w-[20rem]">
                    <FormField label="Name" required>
                        <TextInput
                            {...register("walletName", {
                                required: true,
                                validate: async (name) => {
                                    return await restClient.wallets.exists(name, 0)
                                        ? "The wallet with such a name already exists"
                                        : undefined;
                                }
                            })}
                            autoFocus
                            maxLength={50}
                            readOnly={isSaving}
                            error={errors.walletName}
                        />
                    </FormField>
                    <FormField label="Person">
                        <WalletPersonComboBox
                            control={control}
                            name="personId"
                            disabled={isSaving}
                        />
                    </FormField>
                    <FormField label="Currency" required>
                        <WalletCurrencyComboBox
                            control={control}
                            name="currencyId"
                            required
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
    const id = await restClient.wallets.create(
        values.walletName,
        values.personId.value ? Number(values.personId.value) : null,
        Number(values.currencyId.value)
    );
    cache.onDictionaryChanged("wallets");
    return id;
}