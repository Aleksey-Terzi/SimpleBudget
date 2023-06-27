import * as yup from "yup";
import validatorHelper from "../../../utils/validatorHelper";
import { TaxRateGridModel } from "./taxRateGridModel";

const numberValid = validatorHelper.getMoneyValidator();

export default function getTaxSettingSchema(
    federalTaxRates?: TaxRateGridModel[],
    provincialTaxRates?: TaxRateGridModel[]
) {
    const shape = {
        cppRate: numberValid.required("CPP Rate is a required field"),
        cppMaxAmount: numberValid.required("CPP Max Amount is a required field"),
        eiRate: numberValid.required("EI Rate is a required field"),
        eiMaxAmount: numberValid.required("EI Max Amount is a required field"),
        cppBasicExemptionAmount: numberValid.required("CPP Basic Exemption Amount is a required field"),
        federalBasicPersonalAmount: numberValid.required("Federal Basic Personal Amount is a required field"),
        provincialBasicPersonalAmount: numberValid.required("Provincial Basic Personal Amount is a required field"),
        canadaEmploymentBaseAmount: numberValid.required("Canada Employment Base Amount is a required field"),
    };

    if (federalTaxRates) {
        addRateValidators(shape, federalTaxRates);
    }

    if (provincialTaxRates) {
        addRateValidators(shape, provincialTaxRates);
    }

    return yup.object().shape(shape);
}

function addRateValidators(shape: any, rates: TaxRateGridModel[]) {
    for (let rate of rates) {
        shape[rate.rateFieldName] = numberValid.required("Rate is a required field");
        shape[rate.maxAmountFieldName] = numberValid.required("Max Amount is a required field");
    }
}