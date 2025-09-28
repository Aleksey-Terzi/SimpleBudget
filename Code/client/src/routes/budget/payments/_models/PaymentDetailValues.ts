import { PaymentEditItemModel } from "@/api/models/PaymentEditItemModel";
import { apiDateFormatType } from "@/api/restClient";
import { comboBoxEmptyValue, ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";
import { dateHelper } from "@/helpers/date/dateHelper";
import { DateParts, InvalidDate } from "@/helpers/date/dateTypes";
import { numberHelper } from "@/helpers/numberHelper";

export interface PaymentDetailValues {
    paymentType: string;
    date: DateParts | InvalidDate | null;
    companyName: ComboBoxValue;
    categoryName: ComboBoxValue;
    walletName: ComboBoxValue;
    description: string;
    amount: number | null;
    taxable: boolean;
    taxYear: number | null;
    walletNameTo: ComboBoxValue;
    amountTo: number | null;
    personName: ComboBoxValue;
}

export function defaultPaymentDetailValues(): PaymentDetailValues {
    return {
        paymentType: "expenses",
        date: dateHelper.now(),
        companyName: comboBoxEmptyValue,
        categoryName: comboBoxEmptyValue,
        walletName: comboBoxEmptyValue,
        description: "",
        amount: null,
        taxable: true,
        taxYear: new Date().getFullYear(),
        walletNameTo: comboBoxEmptyValue,
        amountTo: null,
        personName: comboBoxEmptyValue,
    }
};

export function modelToPaymentDetailValues(model: PaymentEditItemModel): PaymentDetailValues {
    return {
        paymentType: model.paymentType.toLowerCase(),
        date: dateHelper.parse(model.date, apiDateFormatType),
        companyName: { value: model.company ?? null, type: "selected" },
        categoryName: { value: model.category ?? null, type: "selected" },
        walletName: { value: model.wallet, type: "selected" },
        description: model.description ?? "",
        amount: Math.abs(numberHelper.fromServerDecimal(model.value)),
        taxable: model.taxable,
        taxYear: model.taxYear ?? null,
        walletNameTo: { value: model.walletTo ?? null, type: "selected" },
        amountTo: numberHelper.fromServerDecimal(model.valueTo),
        personName: { value: model.person ?? null, type: "selected" },
    }
}

export function paymentDetailValuesToModel(values: PaymentDetailValues): PaymentEditItemModel {
    return {
        paymentType: values.paymentType[0].toUpperCase() + values.paymentType.substring(1),
        date: dateHelper.format(values.date as DateParts, apiDateFormatType)!,
        company: values.companyName.value,
        category: values.categoryName.value,
        wallet: values.walletName.value!,
        description: values.description,
        value: numberHelper.toServerDecimal(values.amount!),
        taxable: values.taxable,
        taxYear: values.taxYear,
        walletTo: values.walletNameTo.value,
        valueTo: numberHelper.toServerDecimal(values.amountTo),
        person: values.personName.value,
    }
}