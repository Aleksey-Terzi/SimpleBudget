import { ItemModel } from "@/api/models/ItemModel";
import { WalletSelectorsModel } from "@/api/models/WalletSelectorsModel";
import { restClient } from "@/api/restClient";
import { ComboBoxItem } from "@/components/inputs/combobox/ComboBoxItem";
import { waitHelper } from "@/helpers/waitHelper";

let _model: WalletSelectorsModel | null = null;

export const _walletSelectorCache = {
    getPersons(includeEmpty?: boolean) {
        return get(model => model.persons, includeEmpty);
    },

    getCurrencies(includeEmpty?: boolean) {
        return get(model => model.currencies, includeEmpty);
    },

    refresh() {
        _model = null;
    },
}

function get(getCollection: (model: WalletSelectorsModel) => ItemModel[], includeEmpty?: boolean) {
    if (_model) {
        return toComboBoxItems(getCollection(_model), includeEmpty);
    }
    return waitHelper.run("walletSelectorCache", () => restClient.wallets.selectors())
        .then(result => {
            _model = result;
            return toComboBoxItems(getCollection(_model), includeEmpty);
        });
}

function toComboBoxItems(items: ItemModel[], includeEmpty?: boolean): ComboBoxItem[] {
    const result = items.map(v => ({
        value: String(v.id),
        text: v.name,
    }));
    if (includeEmpty === true) {
        result.splice(0, 0, { text: "", value: "" });
    }
    return result;
}