import { apiDateFormatType, restClient } from "@/api/restClient";
import { dateHelper } from "@/helpers/date/dateHelper";
import { numberHelper } from "@/helpers/numberHelper";
import { cache } from "@/cache/cache";
import DeleteForm from "@/routes/_shared/DeleteForm";

export default function PaymentDelete() {
    return (
        <DeleteForm
            entityName="payment"
            onLoad={load}
            onDelete={del}
        />
    );
}

async function load(id: number) {
    const model = await restClient.payments.get(id);
    const result = [
        { label: "Type", value: model.paymentType },
        { label: "Date", value: dateHelper.format(dateHelper.parse(model.date, apiDateFormatType), "mmm d, yyyy") },
        { label: "Company", value: model.company },
        { label: "Category", value: model.category },
        { label: "Wallet", value: model.wallet },
        { label: "Description", value: model.description },
        { label: "Amount", value: numberHelper.formatServerDecimal(model.value) },
    ];

    if (model.walletTo && model.valueTo) {
        result.push({ label: "Transfer to Wallet", value: model.walletTo });
        result.push({ label: "Transfer to Amount", value: numberHelper.formatServerDecimal(model.valueTo) });
    }

    return result;
}

async function del(id: number) {
    await restClient.payments.del(id);
    cache.onPaymentChanged(null);
}