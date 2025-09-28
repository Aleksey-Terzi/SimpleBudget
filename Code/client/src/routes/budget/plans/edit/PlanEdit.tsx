import { modelToPlanDetailValues, PlanDetailValues, planDetailValuesToModel } from "../_models/PlanDetailValues";
import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import PlanDetail from "../_shared/PlanDetail";
import { useEditForm } from "@/hooks/useEditForm";

export default function PlanEdit() {
    const {
        backUrl,
        isLoaded,
        isSaving,
        register,
        control,
        errors,
        handleSubmit,
    } = useEditForm(
        
        "Plan",

        async (id: number) => {
            const model = await restClient.planPayments.get(id);
            return modelToPlanDetailValues(model);
        },

        async (id: number, values: PlanDetailValues) => {
            const model = planDetailValuesToModel(values);

            await restClient.planPayments.update(id, model);
            
            cache.onPlanChanged(id, values.categoryName.value, values.companyName.value);
        }
    );

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <PlanDetail
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