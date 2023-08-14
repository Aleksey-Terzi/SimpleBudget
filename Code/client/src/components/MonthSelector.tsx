import { ChangeEvent, ForwardedRef, forwardRef } from "react";
import { Form } from "react-bootstrap";
import dateHelper from "../utils/dateHelper";

interface Props {
    defaultMonth?: number;
    className?: string;
    allowEmpty?: boolean;
    disabled?: boolean;
    onChange?: (e: ChangeEvent) => void;
}

const MonthSelector = forwardRef((props: Props, ref: ForwardedRef<HTMLSelectElement>) => {
    const monthNames = [...dateHelper.monthNames];
    monthNames.reverse();

    return (
        <Form.Select
            ref={ref}
            className={props.className}
            defaultValue={props.defaultMonth}
            disabled={props.disabled}
            onChange={props.onChange}
        >
            {props.allowEmpty !== false ? <option></option> : <></>}
            {monthNames.map((monthName, index) => (
                <option key={monthName} value={12 - index}>
                    {monthName}
                </option>
            ))}
        </Form.Select>
    );
});

export default MonthSelector;