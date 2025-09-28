import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { useEditForm } from "@/hooks/useEditForm";
import FormSection from "@/components/form/FormSection";
import Button from "@/components/Button";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import { ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";
import WalletPersonComboBox from "@/routes/_shared/WalletPersonComboBox";
import WalletCurrencyComboBox from "@/routes/_shared/WalletCurrencyComboBox";

interface FormValues {
    walletName: string;
    originalWalletName: string;
    personId: ComboBoxValue;
    currencyId: ComboBoxValue;
    paymentCount: number;
}

export default function WalletEdit() {
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
        "Wallet",
        load,
        save,
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
                                    return name !== getValues("originalWalletName") && await restClient.wallets.exists(name, id)
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
    const model = await restClient.wallets.get(id, false);
    return {
        walletName: model.walletName,
        originalWalletName: model.walletName,
        personId: { value: model.personId ? String(model.personId) : null, type: "selected" },
        currencyId: { value: String(model.currencyId), type: "selected" },
        paymentCount: model.paymentCount,
    }
}

async function save(id: number, values: FormValues) {
    await restClient.wallets.update(
        id,
        values.walletName,
        values.personId.value ? Number(values.personId.value) : null,
        Number(values.currencyId.value)
    );
    cache.onDictionaryChanged("wallets");
}