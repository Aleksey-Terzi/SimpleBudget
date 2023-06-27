import { TaxRateModel } from "./taxRateModel";

export interface TaxSettingEditModel {
    cppRate?: number;
    cppMaxAmount?: number;
    eiRate?: number;
    eiMaxAmount?: number;
    cppBasicExemptionAmount?: number;
    federalBasicPersonalAmount?: number;
    provincialBasicPersonalAmount?: number;
    canadaEmploymentBaseAmount?: number;
    federalTaxRates: TaxRateModel[];
    provincialTaxRates: TaxRateModel[];
}