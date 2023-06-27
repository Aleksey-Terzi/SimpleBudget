import * as yup from "yup"
import numberHelper from "./numberHelper";

const validatorHelper = {
    getMoneyValidator: () => {
        return yup
            .string()
            .test(
                "numberValid",
                "A positive number is expected",
                (x) => {
                    const result = numberHelper.parseNumber(x);
                    return (result === undefined) || (!isNaN(result) && result > 0);
                }
            );
    }
}

export default validatorHelper;