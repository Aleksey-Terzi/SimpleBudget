import numberHelper from "./numberHelper"; 

const validatorHelper2 = {
    moneyValidator: (value?: string) => {
        if (!value || value.length === 0) {
            return undefined;
        }

        const result = numberHelper.parseNumber(value);
        return (result !== undefined) && (isNaN(result) || result <= 0)
            ? "A positive number is expected"
            : undefined;
    },
    integerValidator: (value?: string) => {
        if (!value || value.length === 0) {
            return undefined;
        }

        const result = Number(value);
        return (result !== undefined) && (isNaN(result) || result <= 0 || Math.round(result) !== result)
            ? "A positive integer number is expected"
            : undefined;
    }
};

export default validatorHelper2;