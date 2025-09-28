import { TaxSettingEditModel } from "@/api/models/TaxSettingEditModel";
import { numberHelper } from "@/helpers/numberHelper";

export interface TaxEditRate {
    rate: number | null;
    maxAmount: number | null;
}

export interface TaxEditValues {
    cppRate: number | null;
    cppMaxAmount: number | null;
    eiRate: number | null;
    eiMaxAmount: number | null;
    cppBasicExemptionAmount: number | null;
    federalBasicPersonalAmount: number | null;
    provincialBasicPersonalAmount: number | null;
    canadaEmploymentBaseAmount: number | null;

    federalTaxRates: TaxEditRate[];
    provincialTaxRates: TaxEditRate[];
}

export function modelToTaxEditValues(model: TaxSettingEditModel): TaxEditValues {
    return {
        cppRate: numberHelper.serverRateToPercent(model.cppRate),
        cppMaxAmount: numberHelper.fromServerDecimal(model.cppMaxAmount),
        eiRate: numberHelper.serverRateToPercent(model.eiRate),
        eiMaxAmount: numberHelper.fromServerDecimal(model.eiMaxAmount),
        cppBasicExemptionAmount: numberHelper.fromServerDecimal(model.cppBasicExemptionAmount),
        federalBasicPersonalAmount: numberHelper.fromServerDecimal(model.federalBasicPersonalAmount),
        provincialBasicPersonalAmount: numberHelper.fromServerDecimal(model.provincialBasicPersonalAmount),
        canadaEmploymentBaseAmount: numberHelper.fromServerDecimal(model.canadaEmploymentBaseAmount),

        federalTaxRates: model.federalTaxRates.map(({ rate, maxAmount }) => ({
            rate: numberHelper.serverRateToPercent(rate),
            maxAmount: numberHelper.fromServerDecimal(maxAmount),
        })),

        provincialTaxRates: model.provincialTaxRates.map(({ rate, maxAmount }) => ({
            rate: numberHelper.serverRateToPercent(rate),
            maxAmount: numberHelper.fromServerDecimal(maxAmount),
        })),
    }
}

export function taxEditValuesToModel(values: TaxEditValues): TaxSettingEditModel {
    return {
        cppRate: numberHelper.percentToServerRate(values.cppRate),
        cppMaxAmount: numberHelper.toServerDecimal(values.cppMaxAmount),
        eiRate: numberHelper.percentToServerRate(values.eiRate),
        eiMaxAmount: numberHelper.toServerDecimal(values.eiMaxAmount),
        cppBasicExemptionAmount: numberHelper.toServerDecimal(values.cppBasicExemptionAmount),
        federalBasicPersonalAmount: numberHelper.toServerDecimal(values.federalBasicPersonalAmount),
        provincialBasicPersonalAmount: numberHelper.toServerDecimal(values.provincialBasicPersonalAmount),
        canadaEmploymentBaseAmount: numberHelper.toServerDecimal(values.canadaEmploymentBaseAmount),

        federalTaxRates: values.federalTaxRates.map(({ rate, maxAmount }) => ({
            rate: numberHelper.percentToServerRate(rate!),
            maxAmount: numberHelper.toServerDecimal(maxAmount!),
        })),

        provincialTaxRates: values.provincialTaxRates.map(({ rate, maxAmount }) => ({
            rate: numberHelper.percentToServerRate(rate!),
            maxAmount: numberHelper.toServerDecimal(maxAmount!),
        })),
    }
}