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
    },
    getWalletValidator: (wallets: string[]) => {
        return yup
            .string()
            .test(
                "walletExists",
                "Wallet doesn't exist",
                (item) => !!(!item || wallets.find(x => x.toLowerCase() === item?.toLowerCase()))
            );
    },
    getFileRequired: () => {
        return yup
            .mixed()
            .test("fileRequired", "The file is required", x => x && (x as any).length);
    }
}

export default validatorHelper;