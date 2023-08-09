import { Form } from "react-bootstrap";
import { FieldValues, UseFormReturn } from "react-hook-form";
import numberHelper from "../utils/numberHelper";

interface Props {
    name: string;
    autoFocus?: boolean;
    formSettings: UseFormReturn<FieldValues, any>;
    disabled?: boolean;
    defaultValue?: number;
    maxLength?: number;
    className?: string;
    type: "percent" | "money";
}

export default function NumericInput(props: Props) {
    const { register, formState: { errors } } = props.formSettings;

    let defaultValueText;
    switch (props.type) {
        case "percent":
            defaultValueText = props.defaultValue ? (100 * props.defaultValue).toFixed(2) : "";
            break;
        case "money":
            defaultValueText = numberHelper.formatNumber(props.defaultValue);
            break;
    }

    return (
        <Form.Control
            type="text"
            autoFocus={props.autoFocus}
            className={props.className}
            maxLength={props.maxLength || 20}
            defaultValue={defaultValueText}
            disabled={props.disabled}
            isInvalid={!!errors[props.name]}
            title={errors[props.name]?.message as string}
            {...register(props.name)}
        />
    );
}