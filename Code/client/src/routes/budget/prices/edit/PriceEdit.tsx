import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { useEditForm } from "@/hooks/useEditForm";
import PriceDetail from "../_shared/PriceDetail";
import { modelToPriceDetailValues, PriceDetailValues, priceDetailValuesToModel } from "../_models/PriceDetailValues";

export default function PriceEdit() {
    const {
        backUrl,
        isLoaded,
        isSaving,
        register,
        control,
        errors,
        handleSubmit,
    } = useEditForm(
        
        "Price",

        async (id: number) => {
            const model = await restClient.productPrices.get(id);
            return modelToPriceDetailValues(model);
        },

        async (id: number, values: PriceDetailValues) => {
            const model = priceDetailValuesToModel(values);

            await restClient.productPrices.update(id, model);
            
            cache.onPriceChanged(id, values.categoryName.value, values.companyName.value);
        }
    );

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <PriceDetail
                isLoaded={isLoaded}
                isSaving={isSaving}
                backUrl={backUrl}
                register={register}
                control={control}
                errors={errors}
            />
        </form>
    );
}