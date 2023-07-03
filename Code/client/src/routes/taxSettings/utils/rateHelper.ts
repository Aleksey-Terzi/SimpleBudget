import numberHelper from "../../../utils/numberHelper";
import { TaxRateGridModel } from "../models/taxRateGridModel";
import { TaxRateModel } from "../models/taxRateModel";

export type NamePrefix = "fed" | "prov";

function createGridRate (id: number, namePrefix: NamePrefix, rate?: number, maxAmount?: number) {
    return {
        id,
        rateFieldName: `${namePrefix}_rate_${id}`,
        maxAmountFieldName: `${namePrefix}_maxAmount_${id}`,
        rate,
        maxAmount
    }
}

export const rateHelper = {
    initRates: (namePrefix: NamePrefix, modelRates: TaxRateModel[], nextRateId: number) => {
        const gridRates: TaxRateGridModel[] = [];

        for (let i = 0; i < modelRates.length; i++) {
            const modelRate = modelRates[i];
            const id = nextRateId + i;

            const gridRate = createGridRate(id, namePrefix, modelRate.rate, modelRate.maxAmount);

            gridRates.push(gridRate);
        }

        return gridRates;
    },

    saveRates: (namePrefix: NamePrefix, values: any) => {
        const rates: TaxRateModel[] = [];
        const startsWith = `${namePrefix}_rate_`;

        for (let rateKey in values) {
            if (!rateKey.startsWith(startsWith)) continue;

            const maxAmountKey = `${namePrefix}_maxAmount_${rateKey.substring(startsWith.length)}`;

            const rateItem = {
                rate: numberHelper.parseNumber(values[rateKey])! / 100,
                maxAmount: numberHelper.parseNumber(values[maxAmountKey])!
            };

            rates.push(rateItem);
        }

        return rates;
    },

    deleteRate: (id: number, rates: TaxRateGridModel[]): [TaxRateGridModel | null, TaxRateGridModel[]] => {
        const index = rates!.findIndex(x => x.id === id);
        if (index < 0) {
            return [null, rates];
        }

        const deletedRate = rates[index];

        const newRates = [...rates];
        newRates.splice(index, 1);

        return [deletedRate, newRates];
    }
}