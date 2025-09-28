import { Control, Path, useController } from "react-hook-form";
import ComboBox, { ComboBoxProps } from "./ComboBox";
import { comboBoxEmptyValue, ComboBoxValue } from "./ComboBoxValue";

export interface ControlledComboBoxProps<Criteria extends object>
    extends Omit<ComboBoxProps, "ref" | "value" | "defaultValue" | "error" | "onBlur" | "onChange">
{
    name: Path<Criteria>;
    control: Control<Criteria>;
    required?: boolean;
    allowCustomValue?: boolean;
    validate?: (value: ComboBoxValue) => string | undefined;
    onChange?: (value: ComboBoxValue) => void;
}

export default function ControlledComboBox<Criteria extends object>({
    name,
    control,
    required,
    allowCustomValue,
    validate,
    onChange,
    ...comboBoxProps
}: ControlledComboBoxProps<Criteria>) {
    const { field, fieldState } = useController({
        name,
        control,
        rules: {
            validate: (value: ComboBoxValue | null | undefined) => {
                const definedValue = value ?? comboBoxEmptyValue;
                if (required && !definedValue.value) {
                    return "The field is required";
                }
                if (allowCustomValue === false && definedValue.value && definedValue.type === "custom") {
                    return "The value should be selected from the list";
                }
                return validate?.(definedValue);
            },
            onChange: onChange
                ? e => onChange(e.target.value)
                : undefined
        },
    });

    return (
        <ComboBox
            {...comboBoxProps}
            ref={field.ref}
            value={field.value}
            error={fieldState.error}
            onChange={field.onChange}
            onBlur={field.onBlur}
        />
    )
}