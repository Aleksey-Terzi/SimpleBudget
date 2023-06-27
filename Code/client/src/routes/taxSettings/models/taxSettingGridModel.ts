export interface TaxSettingGridModel {
    year: number;
    cppRateFormatted?: string;
    cppMaxAmountFormatted?: string
    eiRateFormatted?: string;
    eiMaxAmountFormatted?: string;
    cppBasicExemptionAmountFormatted?: string;
    federalBasicPersonalAmountFormatted?: string;
    provincialBasicPersonalAmountFormatted?: string;
    canadaEmploymentBaseAmountFormatted?: string;
}