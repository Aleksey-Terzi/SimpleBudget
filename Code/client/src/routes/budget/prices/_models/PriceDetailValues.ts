import { ProductPriceEditModel } from "@/api/models/ProductPriceEditModel";
import { apiDateFormatType } from "@/api/restClient";
import { comboBoxEmptyValue, ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";
import { dateHelper } from "@/helpers/date/dateHelper";
import { DateParts, InvalidDate } from "@/helpers/date/dateTypes";
import { numberHelper } from "@/helpers/numberHelper";

export interface PriceDetailValues {
    productName: ComboBoxValue;
    companyName: ComboBoxValue;
    categoryName: ComboBoxValue;
    priceDate: DateParts | InvalidDate | null;
    price: number | null;
    isDiscount: boolean;
    quantity: number | null;
    description: string;
}

export function defaultPriceDetailValues(): PriceDetailValues {
    return {
        productName: comboBoxEmptyValue,
        companyName: comboBoxEmptyValue,
        categoryName: comboBoxEmptyValue,
        priceDate: dateHelper.now(),
        price: null,
        isDiscount: false,
        quantity: null,
        description: "",
    }
}

export function modelToPriceDetailValues(model: ProductPriceEditModel): PriceDetailValues {
    return {
        productName: { value: model.productName, type: "selected" },
        companyName: { value: model.companyName ?? null, type: "selected" },
        categoryName: { value: model.categoryName ?? null, type: "selected" },
        priceDate: dateHelper.parse(model.priceDate, apiDateFormatType),
        price: numberHelper.fromServerDecimal(model.price),
        isDiscount: model.isDiscount,
        quantity: model.quantity ?? null,
        description: model.description ?? "",
    };
}

export function priceDetailValuesToModel(values: PriceDetailValues): ProductPriceEditModel {
    return {
        productName: values.productName.value!,
        companyName: values.companyName.value,
        categoryName: values.categoryName.value,
        priceDate: dateHelper.format(values.priceDate, apiDateFormatType)!,
        price: numberHelper.toServerDecimal(values.price!),
        isDiscount: values.isDiscount,
        quantity: values.quantity,
        description: values.description,
    };
}