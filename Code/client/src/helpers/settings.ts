export const API_URL = import.meta.env.VITE_API_URL as string;
export const HOME_URL = import.meta.env.VITE_HOME_URL as string;

export function isLocal() {
    return process.env.NODE_ENV === "development";
}