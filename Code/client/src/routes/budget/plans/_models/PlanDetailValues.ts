import { PlanPaymentEditItemModel } from "@/api/models/PlanPaymentEditItemModel";
import { apiDateFormatType } from "@/api/restClient";
import { comboBoxEmptyValue, ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";
import { dateHelper } from "@/helpers/date/dateHelper";
import { DateParts, InvalidDate } from "@/helpers/date/dateTypes";
import { numberHelper } from "@/helpers/numberHelper";

export interface PlanDetailValues {
    isActive: string;
    startDate: DateParts | InvalidDate | null;
    endDate: DateParts | InvalidDate | null;
    companyName: ComboBoxValue;
    categoryName: ComboBoxValue;
    walletName: ComboBoxValue;
    description: string;
    amount: number | null;
}

export function defaultPlanDetailValues(): PlanDetailValues {
    return {
        isActive: "true",
        startDate: dateHelper.now(),
        endDate: dateHelper.now(),
        companyName: comboBoxEmptyValue,
        categoryName: comboBoxEmptyValue,
        walletName: comboBoxEmptyValue,
        description: "",
        amount: null,
    }
}

export function modelToPlanDetailValues(model: PlanPaymentEditItemModel): PlanDetailValues {
    return {
        isActive: model.isActive ? "true" : "false",
        startDate: dateHelper.parse(model.startDate, apiDateFormatType),
        endDate: dateHelper.parse(model.endDate, apiDateFormatType),
        companyName: { value: model.company ?? null, type: "selected" },
        categoryName: { value: model.category ?? null, type: "selected" },
        walletName: { value: model.wallet, type: "selected" },
        description: model.description ?? "",
        amount: Math.abs(numberHelper.fromServerDecimal(model.value)),
    }
}

export function planDetailValuesToModel(values: PlanDetailValues): PlanPaymentEditItemModel {
    return {
        isActive: values.isActive === "true",
        paymentType: "Expenses",
        startDate: dateHelper.format(values.startDate, apiDateFormatType)!,
        endDate: dateHelper.format(values.endDate, apiDateFormatType),
        company: values.companyName.value,
        category: values.categoryName.value,
        wallet: values.walletName.value!,
        description: values.description,
        value: numberHelper.toServerDecimal(values.amount!),
        taxable: false,
        taxYear: null,
        person: null,
    }
}