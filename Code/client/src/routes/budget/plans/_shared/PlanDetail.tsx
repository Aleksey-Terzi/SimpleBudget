import { PlanDetailValues } from "../_models/PlanDetailValues";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import FormField from "@/components/form/FormField";
import RadioInput from "@/components/inputs/RadioInput";
import CompanyComboBox from "@/routes/_shared/CompanyComboBox";
import CategoryComboBox from "@/routes/_shared/CategoryComboBox";
import WalletComboBox from "@/routes/_shared/WalletComboBox";
import TextInput from "@/components/inputs/TextInput";
import ControlledDateInput from "@/components/inputs/dateinput/ControlledDateInput";
import ControlledDecimalInput from "@/components/inputs/numeric/ControlledDecimalInput";
import Button from "@/components/Button";
import FormSection from "@/components/form/FormSection";

interface Props {
    isLoaded: boolean,
    isSaving: boolean,
    backUrl: string;
    register: UseFormRegister<PlanDetailValues>,
    control: Control<PlanDetailValues>,
    errors: FieldErrors<PlanDetailValues>,
}

export default function PlanDetail({
    isLoaded,
    isSaving,
    backUrl,
    register,
    control,
    errors,
}: Props)
{
    const isDisabled = !isLoaded || isSaving;

    return (
        <FormSection>
            <div className="max-w-[36rem]">
                <FormField label="Is Active?">
                    <div className="flex gap-3">
                        <RadioInput
                            {...register("isActive")}
                            value="true"
                            disabled={isDisabled}
                        >
                            Yes
                        </RadioInput>
                        <RadioInput
                            {...register("isActive")}
                            value="false"
                            disabled={isDisabled}
                        >
                            No
                        </RadioInput>
                    </div>
                </FormField>

                <FormField label="Start Date" className="max-w-40" required>
                    <ControlledDateInput
                        control={control}
                        name="startDate"
                        required={true}
                        placeholder="MM/dd/yyyy"
                        readOnly={isDisabled}
                    />
                </FormField>

                <FormField label="End Date" className="max-w-40">
                    <ControlledDateInput
                        control={control}
                        name="endDate"
                        placeholder="MM/dd/yyyy"
                        readOnly={isDisabled}
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
                            className="max-w-40"
                            readOnly={isDisabled}
                        />
                    </div>
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