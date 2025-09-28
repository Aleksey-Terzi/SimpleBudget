import { Control, FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import FormField from "@/components/form/FormField";
import CheckInput from "@/components/inputs/CheckInput";
import RadioInput from "@/components/inputs/RadioInput";
import TextInput from "@/components/inputs/TextInput";
import CategoryComboBox from "@/routes/_shared/CategoryComboBox";
import CompanyComboBox from "@/routes/_shared/CompanyComboBox";
import PersonComboBox from "@/routes/_shared/PersonComboBox";
import WalletComboBox from "@/routes/_shared/WalletComboBox";
import { PaymentDetailValues } from "../_models/PaymentDetailValues";
import ControlledDateInput from "@/components/inputs/dateinput/ControlledDateInput";
import ControlledDecimalInput from "@/components/inputs/numeric/ControlledDecimalInput";
import ControlledIntegerInput from "@/components/inputs/numeric/ControlledIntegerInput";
import FormSection from "@/components/form/FormSection";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";

type PaymentType = "expenses" | "income" | "transfer";

interface Props {
    isLoaded: boolean,
    isSaving: boolean,
    backUrl: string;
    register: UseFormRegister<PaymentDetailValues>,
    control: Control<PaymentDetailValues>,
    setValue: UseFormSetValue<PaymentDetailValues>,
    getValues: UseFormGetValues<PaymentDetailValues>,
    errors: FieldErrors<PaymentDetailValues>,
}

export default function PaymentDetail({
    isLoaded,
    isSaving,
    backUrl,
    register,
    control,
    setValue,
    getValues,
    errors,
}: Props)
{
    const [paymentType, setPaymentType] = useState<PaymentType>("expenses");
    const [isTaxesCategory, setIsTaxesCategory] = useState(false);

    const isDisabled = !isLoaded || isSaving;

    function handlePaymentTypeChange() {
        const newPaymentType = getValues("paymentType") as PaymentType;
        if (newPaymentType === "transfer") {
            setValue("categoryName", { value: "Transfer", type: "selected" });
        }
        setPaymentType(newPaymentType);
    }

    function handleCategoryNameChange(value: ComboBoxValue) {
        setIsTaxesCategory(value.value?.toLowerCase() === "taxes");
    }

    useEffect(() => {
        if (!isLoaded) {
            return;
        }
        setPaymentType(getValues("paymentType") as PaymentType);
        setIsTaxesCategory(getValues("categoryName").value?.toLowerCase() === "taxes");
    }, [isLoaded, getValues]);

    return (
        <FormSection>
            <div className="max-w-[36rem]">
                <FormField label="Type">
                    <div className="flex gap-3">
                        <RadioInput
                            {...register("paymentType", {
                                onChange: handlePaymentTypeChange
                            })}
                            value="expenses"
                            disabled={isDisabled}
                        >
                            Expenses
                        </RadioInput>
                        <RadioInput
                            {...register("paymentType", {
                                onChange: handlePaymentTypeChange
                            })}
                            value="income"
                            disabled={isDisabled}
                        >
                            Income
                        </RadioInput>
                        <RadioInput
                            {...register("paymentType", {
                                onChange: handlePaymentTypeChange
                            })}
                            value="transfer"
                            disabled={isDisabled}
                        >
                            Transfer
                        </RadioInput>
                    </div>
                </FormField>

                <FormField label="Date" className="max-w-40" required>
                    <ControlledDateInput
                        control={control}
                        name="date"
                        required={true}
                        placeholder="MM/dd/yyyy"
                        readOnly={isDisabled}
                    />
                </FormField>

                <FormField label="Person" required={paymentType === "income"}>
                    <PersonComboBox
                        control={control}
                        name="personName"
                        validate={value => paymentType === "income" && !value?.value ? "The field is required" : undefined}
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
                        disabled={isDisabled || paymentType === "transfer"}
                        onChange={handleCategoryNameChange}
                    />
                </FormField>

                <FormField label="Wallet" required>
                    <WalletComboBox
                        control={control}
                        name="walletName"
                        required={true}
                        maxLength={50}
                        disabled={isDisabled}
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

                <FormField label="Amount" required>
                    <div className="flex gap-3">
                        <ControlledDecimalInput
                            control={control}
                            name="amount"
                            required
                            min={100}
                            onBlur={() => setValue("amountTo", getValues("amount"))}
                            className="max-w-40"
                            readOnly={isDisabled}
                        />
                        {paymentType === "income" && (
                            <CheckInput
                                {...register("taxable")}
                                disabled={isDisabled}
                            >
                                Taxable
                            </CheckInput>
                        )}
                    </div>
                </FormField>

                {paymentType === "expenses" && isTaxesCategory && (
                    <FormField label="Tax Year" required>
                        <ControlledIntegerInput
                            control={control}
                            name="taxYear"
                            className="max-w-40"
                            readOnly={isDisabled}
                        />
                    </FormField>
                )}

                {paymentType === "transfer" && (
                    <>
                        <FormField label="Transfer to Wallet" required>
                            <WalletComboBox
                                control={control}
                                name="walletNameTo"
                                required={true}
                                maxLength={50}
                                disabled={isDisabled}
                            />
                        </FormField>

                        <FormField label="Transferred Value" required>
                            <ControlledDecimalInput
                                control={control}
                                name="amountTo"
                                required
                                min={100}
                                className="max-w-40"
                                readOnly={isDisabled}
                            />
                        </FormField>
                    </>
                )}
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