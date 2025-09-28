import { _dateParser } from "./_dateParser";
import { DateParts, FormatType, InvalidDate, isInvalidDate, months } from "./dateTypes";

const _formatters = {
    "mm/dd/yyyy": (date: DateParts) => {
        return isValid(date) ? `${padZero(date.month!)}/${padZero(date.day!)}/${date.year!}` : null;
    },
    "yyyy-mm-dd": (date: DateParts) => {
        return isValid(date) ? `${date.year}-${padZero(date.month!)}-${padZero(date.day!)}` : null;
    },
    "mmm d, yyyy": (date: DateParts) => {
        return isValid(date) ? `${months[date.month! - 1].short} ${date.day!}, ${date.year}` : null;
    },
}

function isValid({ day, month, year }: DateParts) {
    return year && year >= _dateParser.minYear && year <= _dateParser.maxYear &&
        month && month >= 1 && month <= 12 &&
        day && day >= 1 && day <= _dateParser.getDaysInMonth(year, month);
}

function padZero(n: number) {
    return n < 10 ? "0" + String(n) : String(n);
}

function format(date: DateParts, formatType: FormatType): string;
function format(date: InvalidDate | undefined | null, formatType: FormatType): null;
function format(date: DateParts | InvalidDate | undefined | null, formatType: FormatType): string | null;
function format(date: DateParts | InvalidDate | undefined | null, formatType: FormatType): string | null {
    return date && !isInvalidDate(date)
        ? _formatters[formatType](date)
        : null;
}

export const dateHelper = {
    parse: _dateParser.parse,
    
    isSeparator(c: string) {
        return _dateParser.separators.includes(c);
    },

    getDaysInMonth: _dateParser.getDaysInMonth,

    format,

    now(): DateParts {
        const n = new Date();
        return {
            day: n.getDate(),
            month: n.getMonth() + 1,
            year: n.getFullYear(),
        }
    },

    equals(d1: DateParts | InvalidDate | null, d2: DateParts | InvalidDate | null) {
        if (!d1 && !d2) {
            return true;
        } else if (!d1 || !d2) {
            return false;
        }

        if (isInvalidDate(d1) !== isInvalidDate(d2)) {
            return false;
        } else if (isInvalidDate(d1) || isInvalidDate(d2)) {
            return true;
        }

        return d1.day === d2.day && d1.month === d2.month && d1.year === d2.year;
    },
}