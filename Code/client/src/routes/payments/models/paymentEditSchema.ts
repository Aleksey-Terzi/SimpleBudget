import * as yup from "yup"
import validatorHelper from "../../../utils/validatorHelper";

export function getPaymentEditSchema(wallets: string[], persons: string[]) {
    const numberValid = validatorHelper.getMoneyValidator();
    const walletExists = validatorHelper.getWalletValidator(wallets);

    return yup.object().shape({
        date: yup.date()
            .required("Date is required"),

        taxYear: yup.number()
            .typeError("The tax year must have 4 digits")
            .max(9999, "Tax year must be less or equal than 9999")
            .min(2010, "Tax year must be greater or equal than 2010")
            .when("category", ([value], schema) => value?.toLowerCase() === "taxes"
                ? schema.required("Tax year is required")
                : schema?.notRequired()
            ),

        wallet: walletExists.required("Wallet is required"),

        value: numberValid.required("Value is required"),

        walletTo: walletExists
            .when("paymentType", ([value], schema) => value?.toLowerCase() === "transfer"
                ? schema.required("Wallet To is required")
                : schema.notRequired()
            ),

        valueTo: numberValid
            .when("paymentType", ([value], schema) => value?.toLowerCase() === "transfer"
                ? schema.required("Value is required")
                : schema.notRequired()
            ),

        person: yup.string()
            .when("paymentType", ([value], schema) => value?.toLowerCase() === "income"
                ? schema.required("Person is required for incomes")
                : schema.notRequired()
            )
            .test(
                "personExists",
                "Person doesn't exist",
                (item) => !!(!item || persons.find(x => x.toLowerCase() === item.toLowerCase()))
            ),

        taxable: yup.boolean()
    })
}