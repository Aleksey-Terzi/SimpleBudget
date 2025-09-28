import { defaultPlanDetailValues, PlanDetailValues, planDetailValuesToModel } from "../_models/PlanDetailValues";
import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import PlanDetail from "../_shared/PlanDetail";
import { useNewForm } from "@/hooks/useNewForm";

export default function PlanNew() {
    const {
        backUrl,
        isSaving,
        register,
        control,
        errors,
        handleSubmit,
    } = useNewForm(

        "Plan",

        defaultPlanDetailValues(),
        
        async (values: PlanDetailValues) => {
            const model = planDetailValuesToModel(values);
            const id = await restClient.planPayments.create(model);
            
            cache.onPlanChanged(id, values.categoryName.value, values.companyName.value);

            return id;
        }
    );

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <PlanDetail
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
