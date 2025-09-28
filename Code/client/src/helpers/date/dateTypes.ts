export interface DateParts {
    day: number | null;
    month: number | null;
    year: number | null
}

export interface InvalidDate {
    isInvalid: true;
    text: string;
}

export type FormatType = "mm/dd/yyyy" | "mmm d, yyyy" | "yyyy-mm-dd";

export const months = [
    { number: 1, name: "January", short: "Jan" },
    { number: 2, name: "February", short: "Feb" },
    { number: 3, name: "March", short: "Mar" },
    { number: 4, name: "April", short: "Apr" },
    { number: 5, name: "May", short: "May" },
    { number: 6, name: "June", short: "Jun" },
    { number: 7, name: "July", short: "Jul" },
    { number: 8, name: "August", short: "Aug" },
    { number: 9, name: "September", short: "Sep" },
    { number: 10, name: "October", short: "Oct" },
    { number: 11, name: "November", short: "Nov" },
    { number: 12, name: "December", short: "Dec" },
];

export function isInvalidDate(value: object | null | undefined): value is InvalidDate {
    return !!value && "isInvalid" in value && value.isInvalid === true;
}

export function isDate(value: object | null | undefined): value is DateParts {
    return !!value && "day" in value && "month" in value && "year" in value;
}