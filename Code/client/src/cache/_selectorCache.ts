import { ProductSelectorModel } from "@/api/models/ProductSelectorModel";
import { SelectorsModel } from "@/api/models/SelectorsModel";
import { restClient } from "@/api/restClient";
import { ComboBoxItem } from "@/components/inputs/combobox/ComboBoxItem";
import { waitHelper } from "@/helpers/waitHelper";

let _selectorsModel: SelectorsModel | null = null;
let _products: ProductSelectorModel[] | null = null;

export const _selectorCache = {
    getProducts() {
        if (_products) {
            return _products;
        }
        return waitHelper.run("productSelectorCache", () => restClient.products.selector())
            .then(result => {
                _products = result;
                return result;
            });
    },

    getCompanies(includeEmpty?: boolean) {
        return get(model => model.companies, includeEmpty);
    },

    getCategories(includeEmpty?: boolean) {
        return get(model => model.categories, includeEmpty);
    },

    getWallets(includeEmpty?: boolean) {
        return get(model => model.wallets, includeEmpty);
    },

    getPersons(includeEmpty?: boolean) {
        return get(model => model.persons, includeEmpty);
    },

    refreshIfCompanyNotExist(name: string | undefined | null | string[]) {
        if (!hasAll(_selectorsModel?.companies, name)) {
            _selectorsModel = null;
        }
    },

    refreshIfCategoryNotExist(name: string | undefined | null | string[]) {
        if (!hasAll(_selectorsModel?.categories, name)) {
            _selectorsModel = null;
        }
    },

    refreshIfProductNotExist(name: string | undefined | null | string[]) {
        if (!_products || !name) {
            return;
        }

        let isChanged: boolean;

        if (Array.isArray(name)) {
            const lowercased = new Set(name.map(x => x.toLowerCase()));
            isChanged = _products.filter(x => lowercased.has(x.productName.toLowerCase())).length !== lowercased.size;
        } else {
            isChanged = !_products.find(x => x.productName.toLowerCase() === name.toLowerCase());
        }

        if (isChanged) {
            _products = null;
        }
    },
}

function hasAll(list: string[] | undefined | null, name: string | undefined | null | string[]) {
    if (!list || !name) {
        return true;
    }

    if (Array.isArray(name)) {
        const lowercased = new Set(name.map(x => x.toLowerCase()));
        return list.filter(x => lowercased.has(x.toLowerCase())).length === lowercased.size;
    }

    return !!list.find(x => x.toLowerCase() === name.toLowerCase());
}

function get(getCollection: (model: SelectorsModel) => string[], includeEmpty?: boolean) {
    if (_selectorsModel) {
        return toComboBoxItems(getCollection(_selectorsModel), includeEmpty);
    }
    return waitHelper.run("selectorCache", () => restClient.selectors.all())
        .then(result => {
            _selectorsModel = result;
            return toComboBoxItems(getCollection(_selectorsModel), includeEmpty);
        });
}

function toComboBoxItems(values: string[], includeEmpty?: boolean): ComboBoxItem[] {
    const result = values.map(v => ({
        value: v,
        text: v,
    }));
    if (includeEmpty === true) {
        result.splice(0, 0, { text: "", value: "" });
    }
    return result;
}