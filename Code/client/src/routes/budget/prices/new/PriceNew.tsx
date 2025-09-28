import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { useNewForm } from "@/hooks/useNewForm";
import PriceDetail from "../_shared/PriceDetail";
import { defaultPriceDetailValues, PriceDetailValues, priceDetailValuesToModel } from "../_models/PriceDetailValues";

export default function PriceNew() {
    const {
        backUrl,
        isSaving,
        register,
        control,
        errors,
        handleSubmit,
    } = useNewForm(

        "Price",

        defaultPriceDetailValues(),
        
        async (values: PriceDetailValues) => {
            const model = priceDetailValuesToModel(values);
            const id = await restClient.productPrices.create(model);
            
            cache.onPriceChanged(id, values.categoryName.value, values.companyName.value);

            return id;
        }
    );

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <PriceDetail
                isLoaded={true}
                isSaving={isSaving}
                backUrl={backUrl}
                register={register}
                control={control}
                errors={errors}
            />
        </form>
    );
}