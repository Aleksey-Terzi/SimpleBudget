import { Control, Path, useController } from "react-hook-form";
import DecimalInput, { DecimalInputProps } from "./DecimalInput";
import { numberHelper } from "@/helpers/numberHelper";

interface Props<Criteria extends object>
    extends Omit<DecimalInputProps, "ref" | "name" | "value" | "defaultValue" | "error" | "onChange">
{
    name: Path<Criteria>;
    control: Control<Criteria>;
    required?: boolean;
    min?: number;
    max?: number;
    validate?: (value: number | null) => string | undefined;
}

export default function ControlledDecimalInput<Criteria extends object>({
    name,
    control,
    required,
    min,
    max,
    validate,
    onBlur,
    ...dateInputProps
}: Props<Criteria>) {
    const { field, fieldState } = useController({
        name,
        control,
        rules: {
            validate: required || min || max || validate ?
                (value: number | null | undefined) => {
                    if (value === undefined) {
                        value = null;
                    }
                    if (required && value === null) {
                        return "The field is required";
                    }
                    if (value !== null)
                    {
                        if (min !== undefined && value < min) {
                            return `The value is expected to be greater or equal to ${numberHelper.formatDecimal(min)}`;
                        }
                        if (max !== undefined && value > max) {
                            return `The value is expected to be less or equal to ${numberHelper.formatDecimal(max)}`;
                        }
                    }
                    return validate?.(value);
                } : undefined,
            onBlur,
        },
    });

    return (
        <DecimalInput
            {...dateInputProps}
            ref={field.ref}
            value={field.value}
            error={fieldState.error}
            onChange={field.onChange}
            onBlur={field.onBlur}
        />
    )
}