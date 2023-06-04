import { useCallback, useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import paramHelper from "../../utils/paramHelper";
import { PaymentModel } from "./models/paymentModel";
import requestHelper from "../../utils/requestHelper";
import PaymentDetail from "./components/PaymentDetail";
import numberHelper from "../../utils/numberHelper";
import { useAppSelector } from "../../utils/storeHelper";
import LoadingPanel from "../../components/LoadingPanel";
import dateHelper from "../../utils/dateHelper";
import responseHelper from "../../utils/responseHelper";
import paymentFilterHelper from "./utils/paymentFilterHelper";

const filterHelper = paymentFilterHelper;

export default function PaymentEdit() {
    const idText = useParams<{ id: string }>().id;
    const { id, action } = paramHelper.getEditorModel(idText);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [item, setItem] = useState<PaymentModel | undefined>();
    const [companies, setCompanies] = useState<string[] | undefined>();
    const [categories, setCategories] = useState<string[] | undefined>();
    const [wallets, setWallets] = useState<string[] | undefined>();
    const [persons, setPersons] = useState<string[] | undefined>();
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { filter } = useAppSelector(state => state.payment);
    const cancelPaymentsUrl = filterHelper.getPaymentsUrl(filter, id);

    const loadData = useCallback(async () => {
        setLoading(true);

        try {
            const initialItem = id ? await requestHelper.Payments.getPayment(id) : undefined;
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
        const item = {
            paymentType: values["paymentType"],
            date: dateHelper.dateToString(values["date"] as Date),
            company: values["company"],
            category: values["category"],
            wallet: values["wallet"],
            description: values["description"],
            value: numberHelper.parseNumber(values["value"])!,
            taxable: values["taxable"] === undefined ? false : values["taxable"],
            taxYear: values["taxYear"],
            walletTo: values["walletTo"],
            valueTo: numberHelper.parseNumber(values["valueTo"]),
            person: values["person"]
        };

        setSaving(true);

        if (id) {
            requestHelper.Payments.updatePayment(id, item)
                .then(() => {
                    navigate(cancelPaymentsUrl);
                })
                .catch(e => {
                    setError(responseHelper.getErrorMessage(e));
                    setSaving(false);
                });
        } else {
            requestHelper.Payments.createPayment(item)
                .then(r => {
                    const paymentsUrl = filterHelper.getPaymentsUrl(filter, r);

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
                    ): (
                        <>Add Payment</>
                    )}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && (
                    <PaymentDetail
                        id={id}
                        item={item}
                        companies={companies!}
                        categories={categories!}
                        wallets={wallets!}
                        persons={persons!}
                        paymentsUrl={cancelPaymentsUrl}
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