import { DictionaryStorageKey, ReportStorageKey } from "./enums";

type SharedActionKey = "selectorCache" | "walletSelectorCache" | "productSelectorCache" | ReportStorageKey | DictionaryStorageKey;

const _sharedActions = new Map<string, Promise<unknown>>();

export const waitHelper = {
    run<T>(sharedActionKey: SharedActionKey, actionFactory: () => Promise<T>): Promise<T> {
        let sharedAction = _sharedActions.get(sharedActionKey) as Promise<T>;

        if (!sharedAction) {
            sharedAction = actionFactory()
                .finally(() => {
                    _sharedActions.delete(sharedActionKey);
                });

            _sharedActions.set(sharedActionKey, sharedAction);
        }

        return sharedAction;
    },
}
