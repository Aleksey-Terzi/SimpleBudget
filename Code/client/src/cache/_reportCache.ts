import { ReportStorageKey } from "@/helpers/enums";
import { waitHelper } from "@/helpers/waitHelper";

const _data: Map<ReportStorageKey, object> = new Map();

export const _reportCache = {
    set(storageKey: ReportStorageKey, report: object) {
        _data.set(storageKey, report);
    },

    get,

    delete(storageKey: ReportStorageKey) {
        _data.delete(storageKey);
    },
}

function get<T extends object>(storageKey: ReportStorageKey): T | null;
function get<T extends object>(storageKey: ReportStorageKey, reportFactory: () => Promise<T>): T | Promise<T>;
function get<T extends object>(storageKey: ReportStorageKey, reportFactory?: () => Promise<T>): T | Promise<T> {
    const report = _data.get(storageKey);
    if (report || !reportFactory) {
        return report as T;
    }
    return waitHelper.run<T>(storageKey, reportFactory)
        .then(result => {
            _data.set(storageKey, result as T);
            return result;
        });
}