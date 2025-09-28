import { Control, Path, useController } from "react-hook-form";
import DateInput, { DateInputProps } from "./DateInput";
import { DateParts, InvalidDate, isInvalidDate } from "@/helpers/date/dateTypes";

interface Props<Criteria extends object>
    extends Omit<DateInputProps, "ref" | "value" | "defaultValue" | "error" | "onBlur" | "onChange">
{
    name: Path<Criteria>;
    control: Control<Criteria>;
    required?: boolean;
    validate?: (value: DateParts | InvalidDate | null) => string | undefined;
}

export default function ControlledDateInput<Criteria extends object>({
    name,
    control,
    required,
    validate,
    ...dateInputProps
}: Props<Criteria>) {
    const { field, fieldState } = useController({
        name,
        control,
        rules: {
            validate: (value: DateParts | InvalidDate | null | undefined) => {
                if (isInvalidDate(value)) {
                    return "The date has invalid format";
                }
                if (required && !value) {
                    return "The field is required";
                }
                return validate?.(value ?? null);
            }
        },
    });

    return (
        <DateInput
            {...dateInputProps}
            ref={field.ref}
            value={field.value}
            error={fieldState.error}
            onChange={field.onChange}
            onBlur={field.onBlur}
        />
    )
}