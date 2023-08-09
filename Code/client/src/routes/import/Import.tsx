import { useEffect, useState } from "react";
import { Alert, Card, Form } from "react-bootstrap";
import LoadingPanel from "../../components/LoadingPanel";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import { SuggestedPaymentModel } from "./models/suggestedPaymentModel";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, useForm } from "react-hook-form";
import LoadingButton from "../../components/LoadingButton";
import SearchSelector from "../../components/SearchSelector";
import validatorHelper from "../../utils/validatorHelper";
import ImportPaymentGrid from "./components/ImportPaymentGrid";
import { useAppSelector } from "../../utils/storeHelper";
import paymentFilterHelper from "../payments/utils/paymentFilterHelper";
import { Link } from "react-router-dom";
import { NewImportPaymentModel } from "./models/newImportPaymentModel";

export default function Import() {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>();
    const [info, setInfo] = useState<string>();
    const [companies, setCompanies] = useState<string[]>();
    const [categories, setCategories] = useState<string[]>();
    const [wallets, setWallets] = useState<string[]>();
    const [payments, setPayments] = useState<SuggestedPaymentModel[]>();
    const [valueFormat, setValueFormat] = useState<string>();
    const { filter } = useAppSelector(state => state.payment);
    const cancelPaymentsUrl = paymentFilterHelper.getPaymentsUrl(filter);

    const uploadSchema = yup.object().shape({
        csvFile: validatorHelper.getFileRequired()
    });

    const uploadFormSettings = useForm({
        mode: "onTouched",
        resolver: yupResolver(uploadSchema)
    });

    const walletSchema = wallets && yup.object().shape({
        wallet: validatorHelper
            .getWalletValidator(wallets)
            .required("Wallet is required")
    });

    const walletFormSettings = useForm({
        mode: "onTouched",
        resolver: walletSchema && yupResolver(walletSchema)
    });

    const gridFormSettings = useForm();

    useEffect(() => {
        setLoading(true);

        requestHelper.Selectors.getSelectors()
            .then(r => {
                setCompanies(r.companies);
                setCategories(r.categories);
                setWallets(r.wallets);
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    function onUpload(values: FieldValues) {
        if (payments && !window.confirm("Are you sure to upload this file and override current changes on the form?")) {
            return;
        }

        const csvFile = values["csvFile"][0];

        gridFormSettings.reset();

        setPayments(undefined);
        setInfo(undefined);
        setUploading(true);

        requestHelper.Import.uploadFile(csvFile)
            .then(r => {
                if (!r.error && r.payments.length === 0) {
                    setError("This file does not contain any new payment.");
                } else {
                    setError(r.error);
                    setValueFormat(r.valueFormat);
                    setPayments(r.payments);
                }
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setUploading(false);
            });
    }

    async function onSave() {
        if (!await walletFormSettings.trigger(undefined, { shouldFocus: true })) {
            return;
        }

        const newPayments = createNewPayments();
        if (newPayments.length === 0) {
            setError("There are no selected payments.");
            window.scrollTo(0, 0);
            return;
        }

        const wallet = walletFormSettings.getValues()["wallet"] as string;

        setInfo(undefined);
        setError(undefined);
        setSaving(true);

        try {
            await requestHelper.Import.savePayments(wallet, newPayments);

            gridFormSettings.reset();
            setPayments(undefined);

            setInfo("Selected payment(s) have been saved");
        }
        catch (e) {
            setError(responseHelper.getErrorMessage(e));
            window.scrollTo(0, 0);
        }
        finally {
            setSaving(false);
        }
    }

    function createNewPayments() {
        const gridValues = gridFormSettings.getValues();
        const category = gridValues["category"] as string[];
        const company = gridValues["company"] as string[];
        const description = gridValues["description"] as string[];
        const selected = gridValues["selected"] as boolean[];
        const newPayments: NewImportPaymentModel[] = [];

        for (let i = 0; i < payments!.length; i++) {
            if (!selected[i]) {
                continue;
            }

            const p = payments![i];

            const newPayment = {
                code: p.code,
                date: p.date,
                category: category[i],
                company: company[i],
                value: p.value,
                description: description[i]
            };

            newPayments.push(newPayment);
        }

        return newPayments;
    }

    return (
        <>
            <Card className="mb-3">
                <Card.Header>
                    <Card.Title>
                        Upload TD CSV File
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {loading && <LoadingPanel text="Initializing Screen..." />}
                    {!loading && error && (
                        <Alert variant="danger" className="mb-3">
                            {error}
                        </Alert>
                    )}
                    {info && (
                        <Alert variant="success" className="mb-3">
                            {info}
                        </Alert>
                    )}
                    {!loading && walletFormSettings && (
                        <>
                            <Form noValidate onSubmit={uploadFormSettings.handleSubmit(onUpload)} autoComplete="off">
                                <div className="mb-3">
                                    <label className="form-label">TD CSV File</label>
                                    <div className="align-items-center">
                                        <Form.Control
                                            type="file"
                                            className="w-50 d-inline"
                                            disabled={uploading || saving}
                                            isInvalid={!!uploadFormSettings.formState.errors.csvFile}
                                            title={uploadFormSettings.formState.errors.csvFile?.message as string}
                                            {...uploadFormSettings.register("csvFile")}
                                        />
                                        <LoadingButton
                                            variant="primary"
                                            text="Upload"
                                            className="ms-2"
                                            disabled={saving}
                                            loadingText="Uploading..."
                                            loading={uploading}
                                        />
                                    </div>
                                </div>
                            </Form>
                            <Form noValidate autoComplete="off">
                                <div className="mb-3">
                                    <label className="form-label">Wallet</label>
                                    <SearchSelector className="w-50"
                                        items={wallets}
                                        disabled={uploading || saving}
                                        maxLength={50}
                                        isInvalid={!!walletFormSettings.formState.errors.wallet}
                                        title={walletFormSettings.formState.errors.wallet?.message as string}
                                        {...walletFormSettings.register("wallet")}
                                    />
                                </div>
                            </Form>
                        </>
                    )}
                </Card.Body>
            </Card>

            {payments && valueFormat && companies && categories && (
                <>
                    <Card className="mb-3">
                        <Card.Header>
                            <Card.Title>
                                Suggested Payments
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form noValidate autoComplete="off">
                                <ImportPaymentGrid
                                    valueFormat={valueFormat}
                                    payments={payments}
                                    companies={companies}
                                    categories={categories}
                                    formSettings={gridFormSettings}
                                    saving={saving}
                                />
                            </Form>
                        </Card.Body>
                    </Card>
                </>
            )}

            <LoadingButton
                variant="success"
                text="Save"
                className="me-1"
                loadingText="Saving..."
                disabled={!payments}
                loading={saving}
                onClick={onSave}
            />

            <Link to={cancelPaymentsUrl} className="btn btn-danger">
                Cancel
            </Link>
        </>
    );
}