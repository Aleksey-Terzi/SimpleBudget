import { useCallback, useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import LoadingPanel from "../../components/LoadingPanel";
import { ItemModel } from "../../models/itemModel";
import paramHelper from "../../utils/paramHelper";
import requestHelper from "../../utils/requestHelper";
import responseHelper from "../../utils/responseHelper";
import WalletDetail from "./components/WalletDetail";
import { WalletEditModel } from "./models/walletEditModel";

export default function WalletEdit() {
    const idText = useParams<{ id: string }>().id;
    const { id, action } = paramHelper.getEditorModel(idText);
    const [model, setModel] = useState<WalletEditModel>();
    const [persons, setPersons] = useState<ItemModel[]>();
    const [currencies, setCurrencies] = useState<ItemModel[]>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const loadData = useCallback(async () => {
        setLoading(true);

        try {
            const originalModel = id ? await requestHelper.Wallets.getWallet(id, false) : undefined;
            if (originalModel) {
                setModel(originalModel);
            }

            const selectors = await requestHelper.Wallets.getSelectors();

            setPersons(selectors.persons);
            setCurrencies(selectors.currencies);
        } catch (e) {
            setError(responseHelper.getErrorMessage(e));
        }

        setLoading(false);
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    function handleSave(values: any) {
        const item = {
            walletName: values["name"],
            personId: values["personId"].length > 0 ? Number(values["personId"]) : undefined,
            currencyId: Number(values["currencyId"]),
            paymentCount: 0
        };

        setSaving(true);

        const promise = id
            ? requestHelper.Wallets.updateWallet(id, item)
            : requestHelper.Wallets.createWallet(item);

        promise
            .then(() => {
                navigate("/wallets");
            })
            .catch(e => {
                setError(responseHelper.getErrorMessage(e));
                setSaving(false);
            });
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>
                    {action === "edit" ? (
                        <>Edit Wallet</>
                    ) : (
                        <>Add Wallet</>
                    )}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {!loading && !error && (
                    <WalletDetail id={id} action={action} model={model} persons={persons} currencies={currencies} saving={saving} onSave={handleSave} />
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