import { restClient } from "@/api/restClient";
import { CurrencyEditValues, currencyEditValuesToModel, modelToCurrencyEditValues } from "./CurrencyEditValues";
import { useState } from "react";
import { cache } from "@/cache/cache";
import { useEditForm } from "@/hooks/useEditForm";
import FormSection from "@/components/form/FormSection";
import CurrencyEdit_Detail from "./CurrencyEdit_Detail";
import Button from "@/components/Button";
import CurrencyEdit_Rates from "./CurrencyEdit_Rates";

export default function CurrencyEdit() {
    const [original, setOriginal] = useState<CurrencyEditValues | null>(null);

    const {
        id,
        backUrl,
        isLoaded,
        isSaving,
        register,
        trigger,
        control,
        errors,
        handleSubmit,
    } = useEditForm(
        
        "Currency",

        async (id) => {
            const values = await load(id);

            setOriginal(values);

            return values;
        },

        (id, values) => save(id, values, original!)
    );
    
    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <FormSection>
                <div className="grid grid-cols-[auto,1fr] gap-6">
                    <div>
                        <CurrencyEdit_Detail
                            currencyId={id}
                            originalCode={original?.code}
                            isLoaded={isLoaded}
                            isSaving={isSaving}
                            register={register}
                            errors={errors}
                        />
                        <div className="flex gap-1 mt-6">
                            <Button
                                variant="submit"
                                disabled={!isLoaded}
                                isLoading={isSaving}
                            />
                            <Button
                                variant="cancel"
                                disabled={isSaving}
                                href={backUrl}
                            />
                        </div>
                    </div>
                    <CurrencyEdit_Rates
                        isDisabled={!isLoaded || isSaving}
                        control={control}
                        register={register}
                        trigger={trigger}
                    />
                </div>
            </FormSection>
        </form>
    )
}

async function load(id: number): Promise<CurrencyEditValues> {
    const model = await restClient.currencies.get(id);

    const [rates, pagination] = await restClient.rates.all(id, null, 1);
    for (let i = 2; i <= pagination.totalPages; i++) {
        const [nextRates] = await restClient.rates.all(id, null, i);
        rates.push(...nextRates);
    }

    return modelToCurrencyEditValues(model, rates);
}

async function save(id: number, values: CurrencyEditValues, original: CurrencyEditValues) {
    const {
        currency,
        newRates,
        updatedRates,
        deletedRates
    } = currencyEditValuesToModel(values, original);

    await restClient.currencies.update(id, currency);

    if (newRates.length > 0) {
        for (const rate of newRates) {
            await restClient.rates.create(id, rate);
        }
    }
    
    if (updatedRates.length > 0) {
        for (const { currencyRateId, model } of updatedRates) {
            await restClient.rates.update(id, currencyRateId, model);
        }
    }

    if (deletedRates.length > 0) {
        for (const currencyRateId of deletedRates) {
            await restClient.rates.del(id, currencyRateId);
        }
    }

    cache.onDictionaryChanged("currencies");
}