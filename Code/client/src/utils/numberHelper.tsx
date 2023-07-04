type ApplyColor = "positiveAndNegative" | "positive" | "negative" | "zeroAndNegative" | "zero";

const numberHelper = {
    formatRate: (n: number, digits: number) => {
        const rounder = Math.pow(10, digits);
        const roundedNumber = Math.round(rounder * n) / rounder;

        return roundedNumber.toFixed(digits);
    },

    formatCurrency: (n: number, format: string, applyColor?: ApplyColor) => {
        const startIndex = format.indexOf("{0");
        if (startIndex < 0) {
            throw new Error(`Wrong format: ${format}`);
        }

        const endIndex = format.indexOf("}", startIndex);
        if (endIndex < 0) {
            throw new Error(`Wrong format: ${format}`);
        }

        const [roundedNumber, formattedNumber] = parseNumberFormat(format, n, startIndex, endIndex);

        let result = startIndex > 0 ? format.substring(0, startIndex) : "";
        result += formattedNumber;

        if (endIndex < format.length - 1) {
            result += format.substring(endIndex + 1);
        }

        if (!applyColor) {
            return result;
        }

        switch (applyColor) {
            case "positiveAndNegative":
                return applyPositiveAndNegative(roundedNumber, result);
            case "positive":
                return applyPositive(roundedNumber, result);
            case "negative":
                return applyNegative(roundedNumber, result);
            case "zeroAndNegative":
                return applyZeroAndNegative(roundedNumber, result);
            case "zero":
                return applyZero(roundedNumber, result);
        }
    },

    formatNumber: (n?: number, abs = true) => {
        if (!n) return undefined;

        if (abs) {
            n = Math.abs(n);
        }

        return n.toLocaleString("en-CA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    parseNumber: (s?: string) => {
        if (!s || s.length === 0) return undefined;

        const trimmedValue = s.replaceAll(",", "");

        return Number(trimmedValue);
    }
}

export default numberHelper;

function applyPositiveAndNegative(n: number, formatted: string) {
    if (n === 0) {
        return formatted;
    }

    const className = n < 0 ? "text-danger" : "text-success";

    return <span className={className}>{formatted}</span>;
}

function applyPositive(n: number, formatted: string) {
    return n > 0
        ? <span className="text-success">{formatted}</span>
        : formatted;
}

function applyNegative(n: number, formatted: string) {
    return n < 0
        ? <span className="text-danger">{formatted}</span>
        : formatted;
}

function applyZeroAndNegative(n: number, formatted: string) {
    if (n > 0) {
        return formatted;
    }

    const className = n < 0 ? "text-danger" : "zero";

    return <span className={className}>{formatted}</span>;
}

function applyZero(n: number, formatted: string) {
    return n === 0
        ? <span className="zero">{formatted}</span>
        : formatted;
}

function parseNumberFormat(format: string, n: number, startIndex: number, endIndex: number): [number, string] {
    let digits: number;

    if (startIndex === endIndex - 2) {
        digits = 2;
    } else if (startIndex > endIndex - 3 || format[startIndex + 2] !== ":") {
        throw new Error(`Wrong format: ${format}`);
    } else {
        const digitsText = format.substring(startIndex + 4, endIndex);
        digits = parseInt(digitsText);
        if (isNaN(digits)) {
            throw new Error(`Wrong format: ${format}`);
        }
    }

    const rounder = Math.pow(10, digits);
    const roundedNumber = Math.round(rounder * n) / rounder;

    const formattedNumber = Math.abs(roundedNumber).toLocaleString("en-CA", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });

    return [roundedNumber, formattedNumber];
}