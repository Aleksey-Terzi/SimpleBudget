import { DateParts, FormatType, months } from "./dateTypes";

const separators = ["/", "\\", "-", " ", ","];
const minYear = 2000;
const maxYear = new Date().getFullYear() + 10;

const parsers = {
    "mm/dd/yyyy": (parts: string[]): DateParts | null => {
        if (parts.length < 2 || parts.length > 3) {
            return null;
        }

        const year = parts.length === 3 ? Number(parts[2]) : new Date().getFullYear();
        if (Number.isNaN(year) || year < minYear || year > maxYear) {
            return null;
        }

        const month = Number(parts[0]);
        if (Number.isNaN(month) || month < 1 || month > 12) {
            return null;
        }

        const day = Number(parts[1]);
        if (Number.isNaN(day) || day < 1 || day > getDaysInMonth(year, month)) {
            return null;
        }

        return {
            day,
            month,
            year
        };
    },
    "yyyy-mm-dd": (parts: string[]): DateParts | null => {
        if (parts.length !== 3) {
            return null;
        }

        const year = Number(parts[0]);
        if (Number.isNaN(year) || year < minYear || year > maxYear) {
            return null;
        }

        const month = Number(parts[1]);
        if (Number.isNaN(month) || month < 1 || month > 12) {
            return null;
        }

        const day = Number(parts[2]);
        if (Number.isNaN(day) || day < 1 || day > getDaysInMonth(year, month)) {
            return null;
        }

        return {
            day,
            month,
            year
        };
    },
    "mmm d, yyyy": (parts: string[]): DateParts | null => {
        if (parts.length < 2 || parts.length > 3) {
            return null;
        }

        const year = parts.length === 3 ? Number(parts[2]) : new Date().getFullYear();
        if (Number.isNaN(year) || year < minYear || year > maxYear) {
            return null;
        }

        const month = getMonthByName(parts[0])?.number;
        if (!month || month < 1 || month > 12) {
            return null;
        }

        const day = Number(parts[1]);
        if (Number.isNaN(day) || day < 1 || day > getDaysInMonth(year, month)) {
            return null;
        }

        return {
            day,
            month,
            year
        };
    },
}

function getMonthByName(monthName: string) {
    monthName = monthName.toLowerCase();
    return months.find(x => x.name.toLowerCase() === monthName || x.short.toLowerCase() === monthName);
}

function splitText(s: string | undefined | null) {
    if (!s) {
        return null;
    }

    const result: string[] = [];
    let current = "";

    for (let i = 0; i < s.length; i++) {
        if (!separators.includes(s[i])) {
            current += s[i];
        } else  if (current) {
            result.push(current);
            current = "";
        }
    }

    if (current) {
        result.push(current);
    }

    return result.length ? result : null;
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
}

export const _dateParser = {
    getDaysInMonth,
    splitText,
    parsers,
    separators,
    minYear,
    maxYear,

    parse(date: string | undefined | null, formatType: FormatType | FormatType[] = ["mm/dd/yyyy", "mmm d, yyyy"]) {
        const parts = splitText(date);
        if (!parts) {
            return null;
        }

        const list = Array.isArray(formatType) ? formatType : [formatType];
        for (const current of list) {
            const result = parsers[current](parts);
            if (result) {
                return result;
            }
        }

        return null;
    },
};