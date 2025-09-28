import { apiDateFormatType, restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { dateHelper } from "@/helpers/date/dateHelper";
import { numberHelper } from "@/helpers/numberHelper";
import DeleteForm from "@/routes/_shared/DeleteForm";

export default function PriceDelete() {
    return (
        <DeleteForm
            entityName="price"
            onLoad={load}
            onDelete={del}
        />
    );
}

async function load(id: number) {
    const model = await restClient.productPrices.get(id);
    return [
        { label: "Price Date", value: dateHelper.format(dateHelper.parse(model.priceDate, apiDateFormatType), "mmm d, yyyy") },
        { label: "Product", value: model.productName },
        { label: "Company", value: model.companyName },
        { label: "Category", value: model.categoryName },
        { label: "Description", value: model.description },
        { label: "Price Per Unit", value: (
            <div>
                {numberHelper.formatServerDecimal(model.price)}
                {model.isDiscount ? <span className="ms-2">(Discounted)</span> : null}
            </div>
        )},
        { label: "Quantity", value: model.quantity ? String(model.quantity) : "" },
    ];
}

async function del(id: number) {
    await restClient.productPrices.del(id);
    cache.onPriceChanged(null);
}