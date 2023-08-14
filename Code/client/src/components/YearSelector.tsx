import { ChangeEvent, ForwardedRef, forwardRef } from "react";
import { Form } from "react-bootstrap";

interface Props {
    defaultYear?: number;
    className?: string;
    years?: number[];
    startYear?: number;
    endYear?: number;
    allowEmpty?: boolean;
    disabled?: boolean;
    onChange?: (e: ChangeEvent) => void;
}

const YearSelector = forwardRef((props: Props, ref: ForwardedRef<HTMLSelectElement>) => {
    let years: number[];

    if (props.years) {
        years = props.years;
    } else if (props.startYear) {
        const endYear = props.endYear || new Date().getFullYear();
        years = Array.from({ length: endYear - props.startYear + 1 }, (_, i) => endYear - i);
    } else {
        years = [new Date().getFullYear()];
    }

    return (
        <Form.Select
            ref={ref}
            className={props.className}
            defaultValue={props.defaultYear}
            disabled={props.disabled}
            onChange={props.onChange}
        >
            {props.allowEmpty !== false ? <option></option> : <></>}
            {years.map(year => (
                <option key={year} value={year}>
                    {year}
                </option>
            ))}
        </Form.Select>
    );
});

export default YearSelector;