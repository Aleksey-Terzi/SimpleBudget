import { apiDateFormatType, restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { dateHelper } from "@/helpers/date/dateHelper";
import { numberHelper } from "@/helpers/numberHelper";
import DeleteForm from "@/routes/_shared/DeleteForm";

export default function PlanDelete() {
    return (
        <DeleteForm
            entityName="plan"
            onLoad={load}
            onDelete={del}
        />
    );
}

async function load(id: number) {
    const model = await restClient.planPayments.get(id);

    const startDate = dateHelper.format(dateHelper.parse(model.startDate, apiDateFormatType), "mmm d, yyyy");
    const endDate = model.endDate ? dateHelper.format(dateHelper.parse(model.endDate, apiDateFormatType), "mmm d, yyyy") : null;

    return [
        { label: "Date", value: startDate + (endDate ? ` - ${endDate}` : "") },
        { label: "Company", value: model.company },
        { label: "Category", value: model.category },
        { label: "Wallet", value: model.wallet },
        { label: "Description", value: model.description },
        { label: "Amount", value: numberHelper.formatServerDecimal(model.value) },
    ];
}

async function del(id: number) {
    await restClient.planPayments.del(id);
    cache.onPlanChanged(null);
}