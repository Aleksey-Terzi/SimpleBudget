import { CurrencyEditModel } from "@/api/models/CurrencyEditModel";
import { CurrencyRateEditModel } from "@/api/models/CurrencyRateEditModel";
import { CurrencyRateGridModel } from "@/api/models/CurrencyRateGridModel";
import { apiDateFormatType } from "@/api/restClient";
import { dateHelper } from "@/helpers/date/dateHelper";
import { DateParts } from "@/helpers/date/dateTypes";
import { numberHelper } from "@/helpers/numberHelper";

export interface CurrencyEditValues {
    code: string | null;
    format: string | null;
    walletCount: number;
    rates: {
        currencyRateId: number | null;
        startDate: DateParts | null;
        rate: number | null;
        bankOfCanada: boolean;
    }[];
}

export function modelToCurrencyEditValues(currency: CurrencyEditModel, rates: CurrencyRateGridModel[]): CurrencyEditValues {
    return {
        code: currency.code,
        format: currency.valueFormat,
        walletCount: currency.walletCount,
        rates: rates.map(r => ({
            currencyRateId: r.currencyRateId,
            startDate: dateHelper.parse(r.startDate, apiDateFormatType),
            rate: numberHelper.fromServerDecimal(r.rate),
            bankOfCanada: r.bankOfCanada,
        }))
    };
}

export function currencyEditValuesToModel(values: CurrencyEditValues, original: CurrencyEditValues) {
    const currency: CurrencyEditModel = {
        code: values.code!,
        valueFormat: values.format!,
        walletCount: 0,
    };

    const newRates: CurrencyRateEditModel[] = values.rates.filter(r => r.currencyRateId === null).map(toRateModel);

    const updatedRates = values.rates.filter(r =>
        r.currencyRateId !== null
        && !original.rates.find(o =>
                o.currencyRateId === r.currencyRateId
                && dateHelper.equals(r.startDate, o.startDate)
                && r.rate === o.rate
                && r.bankOfCanada === o.bankOfCanada
            )
    ).map(r => ({
        currencyRateId: r.currencyRateId!,
        model: toRateModel(r)
    }));

    const deletedRates = original.rates
        .filter(o => !values.rates.find(r => r.currencyRateId === o.currencyRateId))
        .map(r => r.currencyRateId!);

    return {
        currency,
        newRates,
        updatedRates,
        deletedRates
    };
}

function toRateModel(rate: CurrencyEditValues["rates"][0]): CurrencyRateEditModel {
    return {
        startDate: dateHelper.format(rate.startDate, apiDateFormatType)!,
        rate: numberHelper.toServerDecimal(rate.rate!),
        bankOfCanada: rate.bankOfCanada,
    }
}