import { Col, Form, Row } from "react-bootstrap";
import SearchSelector from "../../../components/SearchSelector";
import { PaymentModel } from "../models/paymentModel";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getPaymentEditSchema } from "../models/paymentEditSchema";
import LoadingButton from "../../../components/LoadingButton";
import DeleteLink from "../../../components/DeleteLink";
import numberHelper from "../../../utils/numberHelper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dateHelper from "../../../utils/dateHelper";

interface Props {
    id?: number,
    item?: PaymentModel;
    companies: string[];
    categories: string[];
    wallets: string[];
    persons: string[];
    paymentsUrl: string,
    saving: boolean;
    onSave: (values: any) => void;
}

export default function PaymentDetail({ id, item, companies, categories, wallets, persons, paymentsUrl, saving, onSave }: Props) {
    const validationSchema = getPaymentEditSchema(wallets, persons);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        mode: "onTouched",
        resolver: yupResolver(validationSchema)
    });

    const { onChange: paymentTypeOnChange, onBlur: paymentTypeOnBlur, ref: paymentTypeRef, name: paymentTypeName } = register("paymentType");
    const { onChange: categoryOnChange, onBlur: categoryOnBlur, ref: categoryRef, name: categoryName } = register("category");
    const { onChange: valueOnChange, onBlur: valueOnBlur, ref: valueRef, name: valueName } = register("value");

    const [paymentType, setPaymentType] = useState(item?.paymentType || "Expenses");
    const [category, setCategory] = useState(item?.category);
    const taxYearVisible = paymentType.toLowerCase() === "expenses" && category?.toLowerCase() === "taxes";


    function handlePaymentTypeChange(e: any) {
        paymentTypeOnChange(e);

        const newPaymentType = (document.querySelector("input[name='paymentType']:checked") as any).value;
        setPaymentType(newPaymentType);

        const isTransfer = newPaymentType?.toLowerCase() === "transfer";
        if (isTransfer) {
            setValue("category", "Transfer");
        }
    }

    function handleCategoryChange(e: any) {
        categoryOnChange(e);

        const newCategory = (document.querySelector("input[name='category']") as any).value;
        setCategory(newCategory);
    }

    function handleValueBlur(e: any) {
        if (paymentType?.toLowerCase() === "transfer") {
            const valueTo = (document.querySelector("input[name='valueTo']") as any).value;
            if (!valueTo || valueTo.length === 0) {
                const value = (document.querySelector("input[name='value']") as any).value;
                setValue("valueTo", value);
            }
        }

        valueOnBlur(e);
    }

    return (
        <Form noValidate onSubmit={handleSubmit(onSave)} autoComplete="off">
            <Row>
                <Col md="6">
                    <div className="mb-3">
                        <label className="form-label">Type</label>
                        <div>
                            <Form.Check inline
                                label="Expenses"
                                id="paymentType_expenses"
                                type="radio"
                                value="Expenses"
                                defaultChecked={!item?.paymentType || item?.paymentType.toLowerCase() === "expenses"}
                                disabled={saving}
                                name={paymentTypeName}
                                ref={paymentTypeRef}
                                onChange={handlePaymentTypeChange}
                                onBlur={paymentTypeOnBlur}
                            />
                            <Form.Check inline
                                label="Income"
                                id="paymentType_income"
                                type="radio"
                                value="Income"
                                defaultChecked={item?.paymentType?.toLowerCase() === "income"}
                                disabled={saving}
                                name={paymentTypeName}
                                ref={paymentTypeRef}
                                onChange={handlePaymentTypeChange}
                                onBlur={paymentTypeOnBlur}
                            />
                            <Form.Check inline
                                label="Transfer"
                                id="paymentType_transfer"
                                type="radio"
                                value="Transfer"
                                defaultChecked={item?.paymentType?.toLowerCase() === "transfer"}
                                disabled={saving}
                                name={paymentTypeName}
                                ref={paymentTypeRef}
                                onChange={handlePaymentTypeChange}
                                onBlur={paymentTypeOnBlur}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Date</label>
                        <Form.Control
                            type="date"
                            maxLength={10}
                            defaultValue={item?.date || dateHelper.dateToString(new Date())}
                            disabled={saving}
                            isInvalid={!!errors.date}
                            title={errors.date?.message as string}
                            className="w-25"
                            {...register("date")}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Person</label>
                        <SearchSelector
                            items={persons}
                            defaultValue={item?.person}
                            disabled={saving}
                            maxLength={100}
                            isInvalid={!!errors.person}
                            title={errors.person?.message as string}
                            {...register("person")}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Company</label>
                        <SearchSelector
                            items={companies}
                            defaultValue={item?.company}
                            disabled={saving}
                            maxLength={100}
                            isInvalid={!!errors.company}
                            title={errors.company?.message as string}
                            {...register("company")}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <SearchSelector
                            items={categories}
                            defaultValue={item?.category}
                            disabled={saving || paymentType.toLowerCase() === "transfer"}
                            maxLength={50}
                            isInvalid={!!errors.category}
                            title={errors.category?.message as string}
                            name={categoryName}
                            ref={categoryRef}
                            onChange={handleCategoryChange}
                            onBlur={categoryOnBlur}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Wallet</label>
                        <SearchSelector
                            items={wallets}
                            defaultValue={item?.wallet}
                            disabled={saving}
                            maxLength={50}
                            isInvalid={!!errors.wallet}
                            title={errors.wallet?.message as string}
                            {...register("wallet")}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <Form.Control
                            type="text"
                            disabled={saving}
                            maxLength={100}
                            defaultValue={item?.description}
                            {...register("description")}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Value</label>
                        <div className="row">
                            <div className="col-md-3 pe-0">
                                <Form.Control
                                    type="text"
                                    maxLength={20}
                                    defaultValue={numberHelper.formatNumber(item?.value)}
                                    disabled={saving}
                                    isInvalid={!!errors.value}
                                    title={errors.value?.message as string}
                                    name={valueName}
                                    ref={valueRef}
                                    onChange={valueOnChange}
                                    onBlur={handleValueBlur}
                                />
                            </div>
                            {paymentType.toLowerCase() === "income" && (
                                <div className="col-md-3 align-items-center">
                                    <Form.Check
                                        id="taxable"
                                        defaultChecked={!item || item.taxable}
                                        className="ms-2"
                                        label="Taxable"
                                        {...register("taxable")}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {taxYearVisible && (
                        <div className="mb-3">
                            <label className="form-label">Tax Year</label>
                            <Form.Control
                                type="text"
                                maxLength={4}
                                className="w-25"
                                defaultValue={item?.taxYear || (new Date()).getFullYear()}
                                disabled={saving}
                                isInvalid={!!errors.taxYear}
                                title={errors.taxYear?.message as string}
                                {...register("taxYear")}
                            />
                        </div>
                    )}

                    {paymentType.toLowerCase() === "transfer" && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Transfer to Wallet</label>
                                <SearchSelector
                                    items={wallets}
                                    defaultValue={item?.walletTo}
                                    disabled={saving}
                                    maxLength={50}
                                    isInvalid={!!errors.walletTo}
                                    title={errors.walletTo?.message as string}
                                    {...register("walletTo")}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Transferred Value</label>
                                <Form.Control
                                    type="text"
                                    maxLength={20}
                                    className="w-25"
                                    defaultValue={numberHelper.formatNumber(item?.valueTo)}
                                    disabled={saving}
                                    isInvalid={!!errors.valueTo}
                                    title={errors.valueTo?.message as string}
                                    {...register("valueTo")}
                                />
                            </div>
                        </>
                    )}
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md="6">
                    <LoadingButton
                        variant="success"
                        className="me-1"
                        loading={saving}
                        text="Save Changes"
                        loadingText="Saving..."
                    />

                    <Link to={paymentsUrl} className="btn btn-danger">
                        Cancel
                    </Link>
                </Col>
                {id && (
                    <Col md="6" className="text-end">
                        <DeleteLink
                            to={`/payments/${id}/delete`}
                            disabled={saving}
                        />
                    </Col>
                )}
            </Row>
        </Form>
    )
}