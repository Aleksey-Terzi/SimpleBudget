export interface TaxSettingGridModel {
    year: number;
    cppRate?: number;
    cppMaxAmount?: number
    eiRate?: number;
    eiMaxAmount?: number;
    cppBasicExemptionAmount?: number;
    federalBasicPersonalAmount?: number;
    provincialBasicPersonalAmount?: number;
    canadaEmploymentBaseAmount?: number;
}

export interface TaxSettingModel {
    items: TaxSettingGridModel[],
    valueFormat: string;
}