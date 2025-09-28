import { API_URL, isLocal } from "@/helpers/settings";
import { PaginationData } from "./models/PaginationData";
import { ApiError } from "./ApiError";
import { storageHelper } from "@/helpers/storageHelper";
import { router } from "@/App";

interface Param {
    name: string;
    value: string | undefined | null;
}

export const fetchHelper = {
    setUsername(username: string) {
        storageHelper.set("system", "api", "username", username);
    },

    getUsername() {
        return storageHelper.get("system", "api", "username");
    },

    setToken(token: string | null) {
        storageHelper.set("system", "api", "token", token);
    },
    
    getToken,

    async get<T>(url: string, params?: Param[]): Promise<T> {
        const response = await getResponse(url, params);
        return validateResponse(response);
    },

    async getWithPagination<T>(url: string, params?: Param[]): Promise<[T, PaginationData]> {
        const response = await getResponse(url, params);
        const result = await validateResponse<T>(response);
        return [result, getPagination(response)];
    },

    async post<T>(url: string, body: unknown, params?: Param[]): Promise<T> {
        const response = await postResponse(url, body, params);
        return validateResponse(response);
    },

    async postWithPagination<T>(url: string, body: unknown): Promise<[T, PaginationData]> {
        const response = await postResponse(url, body);
        const result = await validateResponse<T>(response);
        return [result, getPagination(response)];
    },

    async put<T>(url: string, body: unknown): Promise<T> {
        const response = await putResponse(url, body);
        return validateResponse(response);
    },

    async putWithPagination<T>(url: string, body: unknown): Promise<[T, PaginationData]> {
        const response = await putResponse(url, body);
        const result = await validateResponse<T>(response);
        return [result, getPagination(response)];
    },

    async del<T>(url: string): Promise<T> {
        const response = await delResponse(url);
        return validateResponse(response);
    },

    async delWithPagination<T>(url: string): Promise<[T, PaginationData]> {
        const response = await delResponse(url);
        const result = await validateResponse<T>(response);
        return [result, getPagination(response)];
    },
}

function getToken() {
    return storageHelper.get("system", "api", "token");
}

async function getResponse(url: string, params?: Param[]) : Promise<Response> {
    return fetch(API_URL + appendParams(url, params), {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    });
}

async function postResponse(url: string, body: unknown, params?: Param[]): Promise<Response> {
    const request: RequestInit = body instanceof FormData
        ? {
            method: "POST",
            body,
            headers: {
                "Accept": "*/*",
                "Authorization": `Bearer ${getToken()}`,
            }
        } : {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        };

    return fetch(API_URL + appendParams(url, params), request);
}

async function putResponse(url: string, body: unknown): Promise<Response> {
    return fetch(API_URL + url, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    });
}

async function delResponse(url: string): Promise<Response> {
    return fetch(API_URL + url, {
        method: "DELETE",
        headers: {
            "Accept": "*/*",
            "Authorization": `Bearer ${getToken()}`,
        },
    });
}

async function validateResponse<T>(response: Response): Promise<T> {
    if (isLocal()) {
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    let json: unknown;
    try {
        json = response.headers.get("Content-Type")?.includes("application/json")
            ? await response.json()
            : await response.text();
    } catch (e) {
        throw new ApiError(response.status, e instanceof Error ? e.message : "Unknown error");
    }

    if (response.ok) {
        return json as T;
    }
    if (response.status === 401 && window.location.pathname.toLowerCase() !== "/security/login") {
        router.navigate(getLoginUrl());
        return null as T;
    }

    const error = typeof json === "string" ? json : (json as { title: string }).title;
    throw new ApiError(response.status, error);
}

function appendParams(url: string, params?: Param[]) {
    if (!params) {
        return url;
    }

    let first = true;
    for (const { name, value } of params) {
        if (!value) {
            continue;
        }
        url += first ? "?" : "&";
        url += `${name}=${encodeURIComponent(value)}`;
        first = false;
    }

    return url;
}

function getPagination(response: Response) {
    if (!response.ok) {
        return null;
    }
    const paginationJson = response.headers.get("Pagination");
    if (!paginationJson) {
        throw new Error("Pagination is empty");
    }
    return JSON.parse(paginationJson);
}

function getLoginUrl() {
    const returnUrl = encodeURIComponent(window.location.pathname);
    return `/security/login?returnUrl=${returnUrl}`;
}
