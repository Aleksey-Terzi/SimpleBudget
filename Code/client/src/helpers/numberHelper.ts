export type DigitType = 0 | 1 | 2 | 3 | 4;

const _decimalDigits = 4;

function parseInt(input: string | null | undefined): number | null {
    if (!input) {
        return null;
    }

    let s = "";
    for (let i = 0; i < input.length; i++) {
        if (input[i] >= "0" && input[i] <= "9") {
            s += input[i];
        }
        else if (input[i] === ".") {
            break;
        }
    }
    
    const n = Number(s);
    
    return !isNaN(n) ? Math.floor(n) : null;
}

function parseDecimal(s: string): number | null {
    let adjustedValue = "";
    let digitsAfterPoint = -1;
    
    for (let i = 0; i < s.length && digitsAfterPoint !== 0; i++) {
        const c = s[i];
        
        if (c >= "0" && c <= "9") {
            adjustedValue += c;

            if (digitsAfterPoint > 0) {
                digitsAfterPoint--;
            }
        } else if (c === "." && digitsAfterPoint === -1) {
            digitsAfterPoint = _decimalDigits;
        }
    }

    if (digitsAfterPoint === -1) {
        if (!adjustedValue) {
            return null;
        }
        digitsAfterPoint = _decimalDigits;
    }

    while (digitsAfterPoint !== 0) {
        adjustedValue += "0";
        digitsAfterPoint--;
    }

    const result = Number(adjustedValue);

    return Number.isNaN(result)
        ? null
        : result;
}

function prettifyDecimal(s: string, digits: DigitType): string {
    s = s.split(".")[0];

    while (s.length <= _decimalDigits) {
        s = "0" + s;
    }

    let result = "";
    let digitsUntilComma = 1 + (s.length - _decimalDigits - 1) % 3;

    for (let i = 0; i < s.length - _decimalDigits + digits; i++) {
        if (i === s.length - _decimalDigits) {
            result += ".";
        } else if (i < s.length - _decimalDigits && digitsUntilComma === 0) {
            result += ",";
            digitsUntilComma = 3;
        }
        result += s[i];
        digitsUntilComma--;
    }

    return result;
}

function formatDecimal(input: number | string, digits: DigitType): string | null {
    if (typeof input === "string" && !input) {
        return null;
    };

    let n: number | null;

    if (typeof input === "string") {
        n = parseDecimal(input);
        if (n === null) {
            return null;
        }
    } else {
        n = input;
    }

    if (n < 0) {
        n = -n;
    }

    const s = String(n);
    return prettifyDecimal(s, digits);
}

function fromServerDecimal(input: null | undefined): null;
function fromServerDecimal(input: number): number;
function fromServerDecimal(input: number | null | undefined): number | null ;
function fromServerDecimal(input: number | null | undefined): number | null {
    return input === null || input === undefined
        ? null
        : Math.round(input * 10000);
}

function toServerDecimal(input: null | undefined): null;
function toServerDecimal(input: number): number;
function toServerDecimal(input: number | null | undefined): number | null;
function toServerDecimal(input: number | null | undefined): number | null {
    return input === null || input === undefined
        ? null
        : input / 10000;
}

function serverRateToPercent(input: null | undefined): null;
function serverRateToPercent(input: number): number;
function serverRateToPercent(input: number | null | undefined): number | null ;
function serverRateToPercent(input: number | null | undefined): number | null {
    return input === null || input === undefined
        ? null
        : 100 * Math.round(input * 10000);
}

function percentToServerRate(input: null | undefined): null;
function percentToServerRate(input: number): number;
function percentToServerRate(input: number | null | undefined): number | null;
function percentToServerRate(input: number | null | undefined): number | null {
    return input === null || input === undefined
        ? null
        : input / (100 * 10000);
}

export const numberHelper = {
    formatPercent(rate: number) {
        const roundedPercent = Math.round(rate * 10000) / 100;
        return roundedPercent.toFixed(2) + "%";
    },

    formatCurrency(input: number | string | null | undefined): string | null {
        if (input === null || input === undefined) {
            return null;
        }
        const d = formatDecimal(input, 2);
        return d !== null ? "$" + d : null;
    },

    formatDecimal(input: number | string | null | undefined, digits: DigitType = 2): string | null {
        if (input === null || input === undefined) {
            return null;
        }
        return formatDecimal(input, digits);
    },

    formatServerDecimal(input: number | null | undefined, digits: DigitType = 2): string | null {
        return input !== null && input !== undefined
            ? formatDecimal(fromServerDecimal(input), digits)
            : null;
    },

    parseDecimal,

    formatInt(input: number | string) {
        const s = typeof input === "number" ? String(input) : String(parseInt(input));
        let result = "";

        for (let i = s.length - 1, k = 0; i >= 0; i--, k++) {
            if (k !== 0 && k % 3 === 0) {
                result = "," + result;
            }
            result = s[i] + result;
        }

        return result;
    },

    parseInt,

    fromServerDecimal,
    toServerDecimal,
    serverRateToPercent,
    percentToServerRate,
}