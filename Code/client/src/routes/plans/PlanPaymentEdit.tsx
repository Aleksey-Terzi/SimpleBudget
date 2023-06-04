import { useCallback, useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import paramHelper from "../../utils/paramHelper";
import { PlanPaymentModel } from "./models/planPaymentModel";
import requestHelper from "../../utils/requestHelper";
import PlanPaymentDetail from "./components/PlanPaymentDetail";
import numberHelper from "../../utils/numberHelper";
import { useAppSelector } from "../../utils/storeHelper";
import LoadingPanel from "../../components/LoadingPanel";
import dateHelper from "../../utils/dateHelper";
import responseHelper from "../../utils/responseHelper";
import planPaymentFilterHelper from "./utils/planPaymentFilterHelper";

const filterHelper = planPaymentFilterHelper;

export default function PaymentEdit() {
    const idText = useParams<{ id: string }>().id;
    const { id, action } = paramHelper.getEditorModel(idText);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [item, setItem] = useState<PlanPaymentModel | undefined>();
    const [companies, setCompanies] = useState<string[] | undefined>();
    const [categories, setCategories] = useState<string[] | undefined>();
    const [wallets, setWallets] = useState<string[] | undefined>();
    const [persons, setPersons] = useState<string[] | undefined>();
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { filter } = useAppSelector(state => state.planPayment);
    const cancelPaymentsUrl = filterHelper.getPlanPaymentsUrl(filter, id);

    const loadData = useCallback(async () => {
        setLoading(true);

        try {
            const initialItem = id ? await requestHelper.PlanPayments.getPlanPayment(id) : undefined;
            const selectors = await requestHelper.Selectors.getSelectors();

            if (initialItem) {
                setItem(initialItem);
            }

            setCompanies(selectors.companies);
            setCategories(selectors.categories);
            setWallets(selectors.wallets);
            setPersons(selectors.persons);
        } catch (e) {
            setError(responseHelper.getErrorMessage(e));
        }

        setLoading(false);
    }, [id])

    useEffect(() => {
        loadData();
    }, [loadData])

    function handleSave(values: any) {
        const isEndDateEmpty = values["isEndDateEmpty"];

        const item = {
            isActive: values["isActive"] === "true",
            paymentType: values["paymentType"],
            startDate: dateHelper.dateToString(values["startDate"] as Date),
            endDate: !isEndDateEmpty ? dateHelper.dateToStringNullable(values["endDate"] as Date) : undefined,
            company: values["company"],
            category: values["category"],
            wallet: values["wallet"],
            description: values["description"],
            value: numberHelper.parseNumber(values["value"])!,
            taxable: values["taxable"] === undefined ? false : values["taxable"],
            taxYear: values["taxYear"],
            person: values["person"]
        };

        setSaving(true);

        if (id) {
            requestHelper.PlanPayments.updatePlanPayment(id, item)
                .then(() => {
                    navigate(cancelPaymentsUrl);
                })
                .catch(e => {
                    setError(responseHelper.getErrorMessage(e));
                    setSaving(false);
                });
        } else {
            requestHelper.PlanPayments.createPlanPayment(item)
                .then(r => {
                    const paymentsUrl = filterHelper.getPlanPaymentsUrl(filter, r);

                    navigate(paymentsUrl);
                })
                .catch(e => {
                    setError(responseHelper.getErrorMessage(e));
                    setSaving(false);
                });
        }
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>
                    {action === "edit" ? (
                        <>Edit Payment #{id}</>
                    ) : (
                        <>Add Plan Payment</>
                    )}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && (
                    <PlanPaymentDetail
                        id={id}
                        item={item}
                        companies={companies!}
                        categories={categories!}
                        wallets={wallets!}
                        persons={persons!}
                        planPaymentsUrl={cancelPaymentsUrl}
                        saving={saving}
                        onSave={handleSave}
                    />
                )}
                {!loading && error && (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
                {loading && <LoadingPanel text="Initializing Screen..." />}
            </Card.Body>
        </Card>
    );
}