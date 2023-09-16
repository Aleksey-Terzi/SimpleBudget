import { Alert, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import cookieHelper from "../../utils/cookieHelper";
import LoadingButton from "../../components/LoadingButton";
import { useEffect, useState } from "react";
import requestHelper from "../../utils/requestHelper";
import userHelper from "../../utils/userHelper";
import { useNavigate } from "react-router-dom";
import responseHelper from "../../utils/responseHelper";

export default function Login() {
    const validationSchema = yup.object().shape({
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required"),
    });

    const { register, handleSubmit: handleSubmitForm, formState: { errors } } = useForm({
        mode: "onTouched",
        resolver: yupResolver(validationSchema)
    });

    const defaultUsername = cookieHelper.getCookie("username");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [focusUsername, setFocusUsername] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        userHelper.setUser(undefined);
    }, []);

    useEffect(() => {
        if (focusUsername > 0) {
            (document.querySelector("input[name='username']") as any).focus();
        }
    }, [focusUsername]);

    function handleSubmit(values: any) {
        const username = values["username"];
        const password = values["password"];

        setSubmitting(true);

        requestHelper.Login.login(username, password)
            .then(r => {
                const token = r.token;

                userHelper.setUser({ username, token });

                navigate("/payments");
            })
            .catch((e) => {
                if (e?.status === 401) {
                    setError(e.data);
                } else {
                    setError(responseHelper.getErrorMessage(e));
                }

                setFocusUsername(focusUsername + 1);

                setSubmitting(false);
            });
    }

    return (
        <div className="container container-body" style={{ width: "300px" }} >
            <Form noValidate autoComplete="off" onSubmit={handleSubmitForm(handleSubmit)}>
                <Row>
                    <Col md="12">
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <div>
                                <Form.Control
                                    type="text"
                                    autoFocus={!defaultUsername}
                                    defaultValue={defaultUsername}
                                    disabled={submitting}
                                    {...register("username")}
                                    isInvalid={!!errors.username}
                                    title={errors.username?.message as string}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div>
                                <Form.Control
                                    type="password"
                                    autoFocus={!!defaultUsername}
                                    disabled={submitting}
                                    {...register("password")}
                                    isInvalid={!!errors.password}
                                    title={errors.password?.message as string}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>

                <LoadingButton
                    variant="success"
                    text="Login"
                    loadingText="Submitting..."
                    loading={submitting}
                />

                {!submitting && error && (
                    <Alert variant="danger" className="mt-3">
                        {error}
                    </Alert>
                )}
            </Form>
        </div>
    )
}