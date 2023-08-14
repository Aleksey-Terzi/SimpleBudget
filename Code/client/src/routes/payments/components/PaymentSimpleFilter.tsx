import { useRef } from "react";
import { KeyboardEvent } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { PaymentFilterModel } from "../models/paymentFilterModel";
import paymentFilterHelper from "../utils/paymentFilterHelper";

interface Props {
    filter?: PaymentFilterModel;
    onSearchByText: (text: string) => void;
    onSwitchFilter: () => void;
}

export default function PaymentSimpleFilter(props: Props) {
    const filterTextRef = useRef<HTMLInputElement>(null);

    const filterText = paymentFilterHelper.isSimpleFilter(props.filter?.text)
        ? props.filter?.text
        : undefined;

    function searchByText() {
        props.onSearchByText(filterTextRef.current!.value);

        filterTextRef.current!.focus();
    }

    function onFilterTextKeyDown(e: KeyboardEvent) {
        if (e.code === "Enter") {
            searchByText();
        }
    }

    function onClearClick() {
        filterTextRef.current!.value = "";
        searchByText();
    }

    return (
        <Stack direction="horizontal">
            <Form.Control
                ref={filterTextRef}
                type="text"
                className="me-1"
                maxLength={100}
                placeholder="Filter"
                defaultValue={filterText}
                autoComplete="off"
                onKeyDown={onFilterTextKeyDown}
            />
            <Button
                variant="link"
                className="p-1"
                title="Filter"
                onClick={searchByText}
            >
                <i className="bi-search"></i>
            </Button>
            <Button
                variant="link"
                className="p-1"
                title="Clear Filter"
                onClick={onClearClick}
            >
                <i className="bi-x-lg"></i>
            </Button>
            <Button
                variant="link"
                className="p-1 ms-3"
                title="Switch to Advanced Filter"
                onClick={props.onSwitchFilter}
            >
                <i className="bi-card-checklist"></i>
            </Button>
        </Stack>
    );
}