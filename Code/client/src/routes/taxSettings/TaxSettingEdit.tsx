import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton";
import LoadingPanel from "../../components/LoadingPanel";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import TaxSettingDetail from "./components/TaxSettingDetail";
import { TaxSettingEditModel } from "./models/taxSettingEditModel";
import numberHelper from "../../utils/numberHelper";
import TaxRateGrid from "./components/TaxRateGrid";
import { TaxRateGridModel } from "./models/taxRateGridModel";
import getTaxSettingSchema from "./models/taxSettingSchema";
import { NamePrefix, rateHelper } from "./utils/rateHelper";

export default function TaxSettingEdit() {
    const yearText = useParams<{ year: string }>().year;
    let year = parseInt(yearText || "");
    if (isNaN(year)) {
        year = new Date().getFullYear();
    }

    const [model, setModel] = useState<TaxSettingEditModel>();
    const [federalTaxRates, setFederalTaxRates] = useState<TaxRateGridModel[]>();
    const [provincialTaxRates, setProvincialTaxRates] = useState<TaxRateGridModel[]>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const nextRateIdRef = useRef(1);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fromStr = searchParams.get("from");
    const from = fromStr ? parseInt(fromStr) : undefined;
    const readFromYear = from && !isNaN(from) ? from : year;

    const validationSchema = getTaxSettingSchema(federalTaxRates, provincialTaxRates);

    const useFormReturn = useForm({
        mode: "onTouched",
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        setLoading(true);

        requestHelper.TaxSettings.getTaxSetting(readFromYear)
            .then(r => {
                setModel(r);

                setFederalTaxRates(rateHelper.initRates("fed", r.federalTaxRates, 1));
                setProvincialTaxRates(rateHelper.initRates("prov", r.provincialTaxRates, 1 + r.federalTaxRates.length));

                nextRateIdRef.current = r.federalTaxRates.length + r.provincialTaxRates.length;
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setLoading(false);
            })
    }, [readFromYear]);

    function onSave(values: any) {
        const model = {
            cppRate: numberHelper.parseNumber(values["cppRate"])! / 100,
            cppMaxAmount: numberHelper.parseNumber(values["cppMaxAmount"]),
            eiRate: numberHelper.parseNumber(values["eiRate"])! / 100,
            eiMaxAmount: numberHelper.parseNumber(values["eiMaxAmount"]),
            cppBasicExemptionAmount: numberHelper.parseNumber(values["cppBasicExemptionAmount"]),
            federalBasicPersonalAmount: numberHelper.parseNumber(values["federalBasicPersonalAmount"]),
            provincialBasicPersonalAmount: numberHelper.parseNumber(values["provincialBasicPersonalAmount"]),
            canadaEmploymentBaseAmount: numberHelper.parseNumber(values["canadaEmploymentBaseAmount"]),
            federalTaxRates: rateHelper.saveRates("fed", values),
            provincialTaxRates: rateHelper.saveRates("prov", values),
        };

        setSaving(true);

        requestHelper.TaxSettings.updateTaxSetting(year, model)
            .then(() => {
                navigate("/taxsettings");
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setSaving(false);
            });
    }

    function onAddRate(namePrefix: NamePrefix) {
        const newItem = {
            id: nextRateIdRef.current,
            rateFieldName: `${namePrefix}_rate_${nextRateIdRef.current}`,
            maxAmountFieldName: `${namePrefix}_maxAmount_${nextRateIdRef.current}`,
        };

        nextRateIdRef.current++;

        switch (namePrefix) {
            case "fed":
                setFederalTaxRates([newItem, ...federalTaxRates!]);
                break;
            case "prov":
                setProvincialTaxRates([newItem, ...provincialTaxRates!]);
                break;
        }
    }

    function onDeleteRate(namePrefix: NamePrefix, id: number) {
        if (!window.confirm("Are you sure to delete this rate?")) {
            return;
        }

        let setter: (rates: TaxRateGridModel[]) => void;
        let taxRates: TaxRateGridModel[];

        switch (namePrefix) {
            case "fed":
                setter = setFederalTaxRates;
                taxRates = federalTaxRates!;
                break;
            case "prov":
                setter = setProvincialTaxRates;
                taxRates = provincialTaxRates!;
                break;
        }

        const [deletedRate, newTaxRates] = rateHelper.deleteRate(id, taxRates);
        setter(newTaxRates);

        if (deletedRate) {
            useFormReturn.unregister(deletedRate.rateFieldName);
            useFormReturn.unregister(deletedRate.maxAmountFieldName);
        }
    }

    function onDeleteSetting(e: any) {
        e.preventDefault();

        if (!window.confirm("Are you sure to delete settings for this year?")) {
            return;
        }

        setDeleting(true);

        requestHelper.TaxSettings.deleteTaxSetting(year)
            .then(() => {
                navigate("/taxsettings");
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
            })
            .finally(() => {
                setDeleting(false);
            });
    }

    return (
        <>
            {readFromYear !== year && (
                <Alert variant="warning">
                    Settings copied from year {readFromYear}
                </Alert>
            )}
            <Form noValidate autoComplete="off" onSubmit={useFormReturn.handleSubmit(onSave)}>
                <Row className="mb-3">
                    <Col md="4">
                        <Card className="h-100">
                            <Card.Header>
                                <Card.Title>
                                    Tax Settings for Year {year}
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                {!loading && !error && model && (
                                    <TaxSettingDetail model={model} saving={saving || deleting} useFormReturn={useFormReturn} />
                                )}
                                {!loading && error && (
                                    <Alert variant="danger">
                                        {error}
                                    </Alert>
                                )}
                                {loading && <LoadingPanel text="Initializing Screen..." />}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="h-100">
                            <Card.Header>
                                <Card.Title>
                                    Federal Tax Rates
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <TaxRateGrid
                                    rates={federalTaxRates}
                                    formSettings={useFormReturn}
                                    loading={loading}
                                    saving={saving || deleting}
                                    onAddRate={() => onAddRate("fed")}
                                    onDeleteRate={(id) => onDeleteRate("fed", id)}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="h-100">
                            <Card.Header>
                                <Card.Title>
                                    Provincial Tax Rates
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <TaxRateGrid
                                    rates={provincialTaxRates}
                                    formSettings={useFormReturn}
                                    loading={loading}
                                    saving={saving || deleting}
                                    onAddRate={() => onAddRate("prov")}
                                    onDeleteRate={(id) => onDeleteRate("prov", id)}
                                />
                            </Card.Body>
                        </Card>
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
                            disabled={deleting || !!error}
                        />
                        <Link
                            className="btn btn-danger"
                            to="/taxsettings"
                        >
                            Cancel
                        </Link>
                    </Col>
                    <Col md="6" className="text-end">
                        <LoadingButton
                            variant="danger"
                            text="Delete"
                            loadingText="Deleting..."
                            loading={deleting}
                            disabled={saving || !!error}
                            onClick={onDeleteSetting}
                        />
                    </Col>
                </Row>
            </Form>
        </>
    );
}