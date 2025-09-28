import { Control } from "react-hook-form";
import { TaxEditValues } from "./TaxEditValues";
import FormTitle from "@/components/form/FormTitle";
import FormField from "@/components/form/FormField";
import ControlledDecimalInput from "@/components/inputs/numeric/ControlledDecimalInput";
import { taxReferences } from "./taxReferences";

interface Props {
    year: number;
    isDisabled: boolean;
    control: Control<TaxEditValues>;
}

export default function TaxEdit_Settings({
    year,
    isDisabled,
    control,
}: Props) {
    return (
        <div className="
            [&_.field-content]:flex [&_.field-content]:gap-3 [&_.field-content]:items-center
            [&_input]:w-48
            [&_a]:underline
            me-6
        ">
            <FormTitle>Tax Settings for Year {year}</FormTitle>

            <FormField label="CPP Rate %" required>
                <ControlledDecimalInput
                    control={control}
                    name="cppRate"
                    required
                    min={0}
                    max={100 * 10000}
                    autoFocus
                    maxLength={6}
                    readOnly={isDisabled}
                />
                {taxReferences.wwwCpp}
            </FormField>

            <FormField label="CPP Max Amount" required>
                <ControlledDecimalInput
                    control={control}
                    name="cppMaxAmount"
                    required
                    min={0}
                    readOnly={isDisabled}
                />
                {taxReferences.wwwCpp}
            </FormField>

            <FormField label="EI Rate %" required>
                <ControlledDecimalInput
                    control={control}
                    name="eiRate"
                    required
                    min={0}
                    max={100 * 10000}
                    maxLength={6}
                    readOnly={isDisabled}
                />
                {taxReferences.wwwEi}
            </FormField>

            <FormField label="EI Max Amount" required>
                <ControlledDecimalInput
                    control={control}
                    name="eiMaxAmount"
                    required
                    min={0}
                    readOnly={isDisabled}
                />
                {taxReferences.wwwEi}
            </FormField>

            <FormField label="CPP Basic Exemption Amount" required>
                <ControlledDecimalInput
                    control={control}
                    name="cppBasicExemptionAmount"
                    required
                    min={0}
                    readOnly={isDisabled}
                />
                {taxReferences.wwwCpp}
            </FormField>

            <FormField label="Federal Basic Personal Amount" required>
                <ControlledDecimalInput
                    control={control}
                    name="federalBasicPersonalAmount"
                    required
                    min={0}
                    readOnly={isDisabled}
                />
                {taxReferences.wwwFederalBasicPersonalAmount}
            </FormField>

            <FormField label="Provincial Basic Personal Amount" required>
                <ControlledDecimalInput
                    control={control}
                    name="provincialBasicPersonalAmount"
                    required
                    min={0}
                    readOnly={isDisabled}
                />
                {taxReferences.wwwProvincialBasicPersonalAmount}
            </FormField>

            <FormField label="Canada Employment Base Amount" required>
                <ControlledDecimalInput
                    control={control}
                    name="canadaEmploymentBaseAmount"
                    required
                    min={0}
                    readOnly={isDisabled}
                />
                {taxReferences.wwwCanadaEmploymentBaseAmount}
            </FormField>

        </div>
    );
}