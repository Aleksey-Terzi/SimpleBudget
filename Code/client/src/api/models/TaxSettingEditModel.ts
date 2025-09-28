import { TaxRateModel } from "./TaxRateModel";

export interface TaxSettingEditModel {
    cppRate: number | undefined | null;
    cppMaxAmount: number | undefined | null;
    eiRate: number | undefined | null;
    eiMaxAmount: number | undefined | null;
    cppBasicExemptionAmount: number | undefined | null;
    federalBasicPersonalAmount: number | undefined | null;
    provincialBasicPersonalAmount: number | undefined | null;
    canadaEmploymentBaseAmount: number | undefined | null;
    federalTaxRates: TaxRateModel[];
    provincialTaxRates: TaxRateModel[];
}