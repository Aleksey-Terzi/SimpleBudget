import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { PaymentFilterModel } from "../models/paymentFilterModel";
import LoadingButton from "../../../components/LoadingButton";
import dateHelper from "../../../utils/dateHelper";
import numberHelper from "../../../utils/numberHelper";
import { useForceUpdate } from "../../../hooks/useFormUpdate";
import validatorHelper2 from "../../../utils/validatorHelper2";

interface Props {
    filter?: PaymentFilterModel;
    loading: boolean;
    onSearchByText: (text: string) => void;
    onSwitchFilter: () => void;
}

interface FormValues {
    startDateEmpty: boolean;
    endDateEmpty: boolean;
    startDate?: string;
    endDate?: string;
    startValue?: string;
    endValue?: string;
    keyword?: string;
    company?: string;
    category?: string;
    wallet?: string;
}

export default function PaymentAdvancedFilter(props: Props) {
    const forceUpdate = useForceUpdate();

    const { register, setValue, getValues, reset, handleSubmit, formState: { errors } } = useForm<FormValues>({
        mode: "onTouched",
        defaultValues: {
            startDateEmpty: true,
            endDateEmpty: true,
            startDate: "",
            endDate: "",
            startValue: "",
            endValue: "",
            keyword: "",
            company: "",
            category: "",
            wallet: ""
        }
    });

    const startDateEmpty = getValues("startDateEmpty");
    const endDateEmpty = getValues("endDateEmpty");

    useEffect(() => {
        if (!props.filter?.text || props.filter.text.length === 0) {
            return;
        }

        try {
            const model = JSON.parse(props.filter.text) as FormValues;

            setValue("startDateEmpty", !model.startDate);
            setValue("endDateEmpty", !model.endDate);
            setValue("startDate", model.startDate || "");
            setValue("endDate", model.endDate || "");
            setValue("startValue", model.startValue ? numberHelper.formatNumber(model.startValue) : "");
            setValue("endValue", model.endValue ? numberHelper.formatNumber(model.endValue) : "");
            setValue("keyword", model.keyword || "");
            setValue("company", model.company || "");
            setValue("category", model.category || "");
            setValue("wallet", model.wallet || "");
        } catch (SyntaxError) {
            // Do nothing, text contains invalid JSON
        }
    }, [props.filter?.text, setValue]);

    function onFilter(values: FormValues) {
        const advancedFilter = {
            startDate: !values.startDateEmpty ? values.startDate : undefined,
            endDate: !values.endDateEmpty ? values.endDate : undefined,
            startValue: numberHelper.parseNumber(values.startValue),
            endValue: numberHelper.parseNumber(values.endValue),
            keyword: undefinedIfEmpty(values.keyword),
            company: undefinedIfEmpty(values.company),
            category: undefinedIfEmpty(values.category),
            wallet: undefinedIfEmpty(values.wallet)
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
        reset();
        onFilter(getValues());
    }

    function onStartDateEmptyChange(e: any) {
        const date = e.target.checked ? "" : dateHelper.dateToString(new Date());
        setValue("startDate", date);
        forceUpdate();
    }

    function onEndDateEmptyChange(e: any) {
        const date = e.target.checked ? "" : dateHelper.dateToString(new Date());
        setValue("endDate", date);
        forceUpdate();
    }

    return (
        <Form noValidate onSubmit={handleSubmit(onFilter)} autoComplete="off">
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
                                    disabled={props.loading}
                                    className="ms-2"
                                    {...register("startDateEmpty", {
                                        onChange: onStartDateEmptyChange
                                    })}
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
                                    disabled={props.loading}
                                    className="ms-2"
                                    {...register("endDateEmpty", {
                                        onChange: onEndDateEmptyChange
                                    })}
                                />
                            </Col>
                        </Row>
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Value Range</label>
                        <Stack direction="horizontal">
                            <Form.Control
                                className="me-3"
                                maxLength={20}
                                readOnly={props.loading}
                                isInvalid={!!errors.startValue}
                                title={errors.startValue?.message}
                                {...register("startValue", {
                                    validate: validatorHelper2.moneyValidator
                                })}
                            />

                            to

                            <Form.Control
                                className="ms-3"
                                maxLength={20}
                                readOnly={props.loading}
                                isInvalid={!!errors.endValue}
                                title={errors.endValue?.message}
                                {...register("endValue", {
                                    validate: validatorHelper2.moneyValidator
                                })}
                            />
                        </Stack>
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Keyword</label>
                        <div>
                            <Form.Control
                                maxLength={100}
                                readOnly={props.loading}
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