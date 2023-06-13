import { Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingButton from "../../../components/LoadingButton";
import { CurrencyEditModel } from "../models/currencyEditModel";
import * as yup from "yup"
import requestHelper from "../../../utils/requestHelper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DeleteLink from "../../../components/DeleteLink";

interface Props {
    id?: number;
    action: string;
    model?: CurrencyEditModel;
    saving: boolean;
    onSave: (e: any) => void;
}

export default function CurrencyDetail({ id, action, model, saving, onSave }: Props) {
    const validationSchema = yup.object().shape({
        code: yup.string()
            .required("Code is a required field")
            .test(
                "codeUnique",
                "The currency with such a code already exists",
                async (value) => !!value && value.length > 0 && !(await requestHelper.Currencies.currencyExists(value, id))
            ),
        valueFormat: yup.string()
            .required("Value Format is a required field")
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onTouched",
        resolver: yupResolver(validationSchema)
    });

    return (
        <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSave)}>
            <Row>
                <Col md="12">
                    <div className="mb-3">
                        <label className="form-label">Code</label>
                        <Form.Control
                            autoFocus={true}
                            type="text"
                            maxLength={10}
                            defaultValue={model?.code}
                            disabled={saving}
                            isInvalid={!!errors.code}
                            title={errors.code?.message as string}
                            {...register("code")}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Value Format</label>
                        <Form.Control
                            type="text"
                            maxLength={50}
                            defaultValue={model?.valueFormat}
                            disabled={saving}
                            isInvalid={!!errors.valueFormat}
                            title={errors.valueFormat?.message as string}
                            {...register("valueFormat")}
                        />
                    </div>
                    {action === "edit" && (
                        <div className="mb-3">
                            <label className="form-label"># of Wallets</label>
                            <div>
                                {model?.walletCount}
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <LoadingButton
                        variant="success"
                        className="me-1"
                        text="Save Changes"
                        loadingText="Saving Changes..."
                        loading={saving}
                    />
                    <Link
                        className="btn btn-danger"
                        to="/currencies"
                    >
                        Cancel
                    </Link>
                </Col>
                {action === "edit" && (
                    <Col md="6" className="text-end">
                        <DeleteLink
                            to={`/currencies/${id}/delete`}
                            disabled={saving}
                        />
                    </Col>
                )}
            </Row>
        </Form>
    );
}