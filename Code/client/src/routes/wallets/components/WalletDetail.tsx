import { Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingButton from "../../../components/LoadingButton";
import { WalletEditModel } from "../models/walletEditModel";
import * as yup from "yup"
import requestHelper from "../../../utils/requestHelper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DeleteLink from "../../../components/DeleteLink";
import { ItemModel } from "../../../models/itemModel";

interface Props {
    id?: number;
    action: string;
    model?: WalletEditModel;
    persons?: ItemModel[];
    currencies?: ItemModel[];
    saving: boolean;
    onSave: (e: any) => void;
}

export default function WalletDetail({ id, action, model, persons, currencies, saving, onSave }: Props) {
    const validationSchema = yup.object().shape({
        name: yup.string()
            .required("Name is a required field")
            .test(
                "nameUnique",
                "The wallet with such a name already exists",
                async (value) => !!value && value.length > 0 && !(await requestHelper.Wallets.walletExists(value, id))
            ),
        personId: yup.string(),
        currencyId: yup.string()
            .required("Currency is a required field")
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onTouched",
        resolver: yupResolver(validationSchema)
    });

    return (
        <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSave)}>
            <Row>
                <Col md="6">
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <Form.Control
                            autoFocus={true}
                            type="text"
                            maxLength={50}
                            defaultValue={model?.walletName}
                            disabled={saving}
                            isInvalid={!!errors.name}
                            title={errors.name?.message as string}
                            {...register("name")}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Person</label>
                        <Form.Select
                            defaultValue={model?.personId}
                            disabled={saving}
                            isInvalid={!!errors.personId}
                            title={errors.personId?.message as string}
                            {...register("personId")}
                        >
                            <option></option>
                            {persons && persons.map(person => (
                                <option key={person.id} value={person.id}>
                                    {person.name}
                                </option>
                            ))}
                        </Form.Select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Currency</label>
                        <Form.Select
                            defaultValue={model?.currencyId}
                            disabled={saving}
                            isInvalid={!!errors.currencyId}
                            title={errors.currencyId?.message as string}
                            {...register("currencyId")}
                        >
                            <option></option>
                            {currencies && currencies.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </Form.Select>
                    </div>

                    {action === "edit" && (
                        <div className="mb-3">
                            <label className="form-label"># of Payments</label>
                            <div>
                                {model?.paymentCount}
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
            <Row>
                <Col md="3">
                    <LoadingButton
                        variant="success"
                        className="me-1"
                        text="Save Changes"
                        loadingText="Saving Changes..."
                        loading={saving}
                    />
                    <Link
                        className="btn btn-danger"
                        to="/wallets"
                    >
                        Cancel
                    </Link>
                </Col>
                {action === "edit" && (
                    <Col md="3" className="text-end">
                        <DeleteLink
                            to={`/wallets/${id}/delete`}
                            disabled={saving}
                        />
                    </Col>
                )}
            </Row>
        </Form>
    );
}