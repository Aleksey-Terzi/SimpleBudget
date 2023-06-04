import { Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingButton from "../../../components/LoadingButton";
import { CategoryEditModel } from "../models/categoryEditModel";
import * as yup from "yup"
import requestHelper from "../../../utils/requestHelper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DeleteLink from "../../../components/DeleteLink";

interface Props {
    id?: number;
    action: string;
    model?: CategoryEditModel;
    saving: boolean;
    onSave: (e: any) => void;
}

export default function CategoryDetail({ id, action, model, saving, onSave }: Props) {
    const validationSchema = yup.object().shape({
        name: yup.string()
            .required("Name is a required field")
            .test(
                "nameUnique",
                "The category with such a name already exists",
                async (value) => !!value && value.length > 0 && !(await requestHelper.Categories.categoryExists(value, id))
            )
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
                            defaultValue={model?.name}
                            disabled={saving}
                            isInvalid={!!errors.name}
                            title={errors.name?.message as string}
                            {...register("name")}
                        />
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
                        to="/categories"
                    >
                        Cancel
                    </Link>
                </Col>
                {action === "edit" && (
                    <Col md="3" className="text-end">
                        <DeleteLink
                            to={`/categories/${id}/delete`}
                            disabled={saving}
                        />
                    </Col>
                )}
            </Row>
        </Form>
    );
}