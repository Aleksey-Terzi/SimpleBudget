import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { PaymentFilterModel } from "../models/paymentFilterModel";
import validatorHelper from "../../../utils/validatorHelper";
import { useForm } from "react-hook-form";
import NumericInput from "../../../components/NumericInput";
import LoadingButton from "../../../components/LoadingButton";
import { useEffect, useRef, useState } from "react";
import dateHelper from "../../../utils/dateHelper";
import numberHelper from "../../../utils/numberHelper";
import { PaymentAdvancedFilterModel } from "../models/paymentAdvancedFilterModel";

interface Props {
    filter?: PaymentFilterModel;
    loading: boolean;
    onSearchByText: (text: string) => void;
    onSwitchFilter: () => void;
}

export default function PaymentAdvancedFilter(props: Props) {
    const [model, setModel] = useState<PaymentAdvancedFilterModel>();
    const [startDateEmpty, setStartDateEmpty] = useState(true);
    const [endDateEmpty, setEndDateEmpty] = useState(true);
    const formRef = useRef<HTMLFormElement>(null);

    const numberValid = validatorHelper.getMoneyValidator();

    const validationSchema = yup.object().shape({
        startDate: yup.date().default(() => new Date()),
        endDate: yup.date().default(() => new Date()),
        startValue: numberValid,
        endValue: numberValid,
    });

    const formSettings = useForm({
        mode: "onTouched",
        resolver: yupResolver(validationSchema)
    });

    const { register, setValue, reset, handleSubmit, formState: { errors } } = formSettings;

    const startDateEmptyReg = register("startDateEmpty");
    const endDateEmptyReg = register("endDateEmpty");

    useEffect(() => {
        if (!props.filter?.text || props.filter.text.length === 0) {
            return;
        }

        try {
            const defaultModel = JSON.parse(props.filter.text) as PaymentAdvancedFilterModel;

            reset();

            setModel(defaultModel);
            setStartDateEmpty(!defaultModel.startDate);
            setEndDateEmpty(!defaultModel.endDate);
        } catch (SyntaxError) {
            // Do nothing, text contains invalid JSON
        }
    }, [props.filter?.text, setValue, reset]);

    function onFilter() {
        const data = new FormData(formRef.current!);

        const startDateEmpty = data.get("startDateEmpty") === "on";
        const endDateEmpty = data.get("endDateEmpty") === "on";

        const advancedFilter = {
            startDate: !startDateEmpty ? data.get("startDate") as string : undefined,
            endDate: !endDateEmpty ? data.get("endDate") as string : undefined,
            startValue: numberHelper.parseNumber(data.get("startValue") as string)!,
            endValue: numberHelper.parseNumber(data.get("endValue") as string)!,
            keyword: undefinedIfEmpty(data.get("keyword") as string),
            company: undefinedIfEmpty(data.get("company") as string),
            category: undefinedIfEmpty(data.get("category") as string),
            wallet: undefinedIfEmpty(data.get("wallet") as string),
        };

        let json = JSON.stringify(advancedFilter);

        if (json === "{}") {
            json = "";
        }

        props.onSearchByText(json);
    }

    function undefinedIfEmpty(value?: string) {
        return value && value.length > 0 ? value : undefined;
    }

    function onClear() {
        setValue("startDateEmpty", true);
        setValue("endDateEmpty", true);
        setValue("startDate", undefined);
        setValue("endDate", undefined);
        setValue("startValue", undefined);
        setValue("endValue", undefined);
        setValue("keyword", undefined);
        setValue("company", undefined);
        setValue("category", undefined);
        setValue("wallet", undefined);

        setStartDateEmpty(true);
        setEndDateEmpty(true);

        onFilter();
    }

    function onStartDateEmptyChange(e: any) {
        setStartDateEmpty(e.target.checked);

        const date = e.target.checked ? undefined : dateHelper.dateToString(new Date());

        setValue("startDate", date);

        startDateEmptyReg.onChange(e);
    }

    function onEndDateEmptyChange(e: any) {
        setEndDateEmpty(e.target.checked);

        const date = e.target.checked ? undefined : dateHelper.dateToString(new Date());

        setValue("endDate", date);

        endDateEmptyReg.onChange(e);
    }

    return (
        <Form ref={formRef} noValidate onSubmit={handleSubmit(onFilter)} autoComplete="off">
            <Row className="mb-2">
                <Col lg="6">
                    <div className="mb-2">
                        <label className="form-label">Date Range</label>
                        <Row className="mb-1">
                            <Col lg="2" className="align-items-center">
                                From
                            </Col>
                            <Col lg="6">
                                <Form.Control
                                    type="date"
                                    defaultValue={model?.startDate}
                                    disabled={startDateEmpty}
                                    readOnly={props.loading}
                                    isInvalid={!!errors.startDate}
                                    title={errors.startDate?.message as string}
                                    {...register("startDate")}
                                />
                            </Col>
                            <Col lg="4" className="align-items-center">
                                <Form.Check
                                    id="startDateEmpty"
                                    label="Empty"
                                    type="checkbox"
                                    defaultChecked={startDateEmpty}
                                    disabled={props.loading}
                                    className="ms-2"
                                    name={startDateEmptyReg.name}
                                    ref={startDateEmptyReg.ref}
                                    onChange={onStartDateEmptyChange}
                                    onBlur={startDateEmptyReg.onBlur}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="2" className="align-items-center">
                                Thru
                            </Col>
                            <Col lg="6">
                                <Form.Control
                                    type="date"
                                    defaultValue={model?.endDate}
                                    disabled={endDateEmpty}
                                    readOnly={props.loading}
                                    isInvalid={!!errors.endDate}
                                    title={errors.endDate?.message as string}
                                    {...register("endDate")}
                                />
                            </Col>
                            <Col lg="4" className="align-items-center">
                                <Form.Check
                                    id="endDateEmpty"
                                    label="Empty"
                                    type="checkbox"
                                    defaultChecked={endDateEmpty}
                                    disabled={props.loading}
                                    className="ms-2"
                                    name={endDateEmptyReg.name}
                                    ref={endDateEmptyReg.ref}
                                    onChange={onEndDateEmptyChange}
                                    onBlur={endDateEmptyReg.onBlur}

                                />
                            </Col>
                        </Row>
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Value Range</label>
                        <Stack direction="horizontal">
                            <NumericInput
                                name="startValue"
                                type="money"
                                readOnly={props.loading}
                                defaultValue={model?.startValue}
                                formSettings={formSettings}
                                className="me-3"
                            />

                            to

                            <NumericInput
                                name="endValue"
                                type="money"
                                readOnly={props.loading}
                                defaultValue={model?.endValue}
                                formSettings={formSettings}
                                className="ms-3"
                            />
                        </Stack>
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Keyword</label>
                        <div>
                            <Form.Control
                                maxLength={100}
                                readOnly={props.loading}
                                defaultValue={model?.keyword}
                                {...register("keyword")}
                            />
                        </div>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-2">
                        <label className="form-label">Company</label>
                        <div>
                            <Form.Control
                                maxLength={100}
                                readOnly={props.loading}
                                defaultValue={model?.company}
                                {...register("company")}
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Category</label>
                        <div>
                            <Form.Control
                                maxLength={100}
                                readOnly={props.loading}
                                defaultValue={model?.category}
                                {...register("category")}
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Wallet</label>
                        <div>
                            <Form.Control
                                maxLength={100}
                                readOnly={props.loading}
                                defaultValue={model?.wallet}
                                {...register("wallet")}
                            />
                        </div>
                    </div>
                </Col>
            </Row>

            <LoadingButton
                variant="primary"
                loading={props.loading}
                text="Filter"
                loadingText="Filtering..."
                className="me-2"
            />

            <Button
                variant="outline-secondary"
                disabled={props.loading}
                className="me-2"
                onClick={onClear}
            >
                Clear
            </Button>

            <Button
                variant="outline-secondary"
                disabled={props.loading}
                onClick={props.onSwitchFilter}
            >
                Switch to Simple Filter
            </Button>
        </Form>
    );
}