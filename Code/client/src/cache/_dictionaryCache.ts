import { DictionaryStorageKey } from "@/helpers/enums";
import { waitHelper } from "@/helpers/waitHelper";

const _data: Map<DictionaryStorageKey, object> = new Map();

export const _dictionaryCache = {
    set(storageKey: DictionaryStorageKey, report: object) {
        _data.set(storageKey, report);
    },

    get,

    delete(storageKey: DictionaryStorageKey) {
        _data.delete(storageKey);
    },
}

function get<T extends object>(storageKey: DictionaryStorageKey): T | null;
function get<T extends object>(storageKey: DictionaryStorageKey, dictionaryFactory: () => Promise<T>): T | Promise<T>;
function get<T extends object>(storageKey: DictionaryStorageKey, dictionaryFactory?: () => Promise<T>): T | Promise<T> {
    const dictionary = _data.get(storageKey);
    if (dictionary || !dictionaryFactory) {
        return dictionary as T;
    }
    return waitHelper.run<T>(storageKey, dictionaryFactory)
        .then(result => {
            _data.set(storageKey, result as T);
            return result;
        });
}