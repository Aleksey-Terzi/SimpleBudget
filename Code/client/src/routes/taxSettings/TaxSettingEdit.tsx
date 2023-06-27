import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import DeleteLink from "../../components/DeleteLink";
import LoadingButton from "../../components/LoadingButton";
import LoadingPanel from "../../components/LoadingPanel";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import TaxSettingDetail from "./components/TaxSettingDetail";
import { TaxSettingEditModel } from "./models/taxSettingEditModel";
import numberHelper from "../../utils/numberHelper";
import TaxRateGrid from "./components/TaxRateGrid";
import { TaxRateModel } from "./models/taxRateModel";
import { TaxRateGridModel } from "./models/taxRateGridModel";
import getTaxSettingSchema from "./models/taxSettingSchema";

type NamePrefix = "fed" | "prov";

export default function TaxSettingEdit() {
    const yearText = useParams<{ year: string }>().year;
    let year = parseInt(yearText || "");
    if (isNaN(year)) {
        year = new Date().getFullYear();
    }

    const [model, setModel] = useState<TaxSettingEditModel>();
    const [federalTaxRates, setFederalTaxRates] = useState<TaxRateGridModel[]>();
    const [provincialTaxRates, setProvincialTaxRates] = useState<TaxRateGridModel[]>();
    const [nextRateId, setNextRateId] = useState(1);
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
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

                setFederalTaxRates(initRates("fed", r.federalTaxRates, nextRateId));
                setProvincialTaxRates(initRates("prov", r.provincialTaxRates, nextRateId + r.federalTaxRates.length));

                setNextRateId(nextRateId + r.federalTaxRates.length + r.provincialTaxRates.length);
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
            federalTaxRates: saveRates("fed", values),
            provincialTaxRates: saveRates("prov", values),
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

    function saveRates(namePrefix: NamePrefix, values: any) {
        const rates: TaxRateModel[] = [];
        const startsWith = `${namePrefix}_rate_`;

        for (let rateKey in values) {
            if (!rateKey.startsWith(startsWith)) continue;

            const maxAmountKey = `${namePrefix}_maxAmount_${rateKey.substring(startsWith.length)}`;

            const rateItem = {
                rate: numberHelper.parseNumber(values[rateKey])! / 100,
                maxAmount: numberHelper.parseNumber(values[maxAmountKey])!
            };

            rates.push(rateItem);
        }

        return rates;
    }

    function initRates(namePrefix: NamePrefix, modelRates: TaxRateModel[], nextRateId: number) {
        const gridRates: TaxRateGridModel[] = [];

        for (let i = 0; i < modelRates.length; i++) {
            const modelRate = modelRates[i];
            const id = nextRateId + i;

            const gridRate = createGridRate(id, namePrefix, modelRate.rate, modelRate.maxAmount);

            gridRates.push(gridRate);
        }

        return gridRates;
    }

    function createGridRate(id: number, namePrefix: NamePrefix, rate?: number, maxAmount?: number) {
        return {
            id,
            rateFieldName: `${namePrefix}_rate_${id}`,
            maxAmountFieldName: `${namePrefix}_maxAmount_${id}`,
            rate,
            maxAmount
        }
    }

    function onAddRate(namePrefix: NamePrefix) {
        const newItem = {
            id: nextRateId,
            rateFieldName: `${namePrefix}_rate_${nextRateId}`,
            maxAmountFieldName: `${namePrefix}_maxAmount_${nextRateId}`,
        };

        setNextRateId(nextRateId + 1);

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

        switch (namePrefix) {
            case "fed":
                setFederalTaxRates(deleteRate(id, federalTaxRates!));
                break;
            case "prov":
                setProvincialTaxRates(deleteRate(id, provincialTaxRates!));
                break;
        }
    }

    function deleteRate(id: number, rates: TaxRateGridModel[]) {
        const index = rates!.findIndex(x => x.id === id);
        if (index < 0) {
            return rates;
        }

        const newRates = [...rates];
        newRates.splice(index, 1);

        return newRates;
    }

    function onDeleteSetting(e: any) {
        e.preventDefault();

        if (!window.confirm("Are you sure to delete settings for this year?")) {
            return;
        }

        setSaving(true);

        requestHelper.TaxSettings.deleteTaxSetting(year)
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

    return (
        <>
            {readFromYear != year && (
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
                                    useFormReturn={useFormReturn}
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
                                    useFormReturn={useFormReturn}
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
                            disabled={deleting}
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
                            disabled={saving}
                            onClick={onDeleteSetting}
                        />
                    </Col>
                </Row>
            </Form>
        </>
    );
}