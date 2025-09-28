import PaymentDetail from "../_shared/PaymentDetail";
import { restClient } from "@/api/restClient";
import { modelToPaymentDetailValues, PaymentDetailValues, paymentDetailValuesToModel } from "../_models/PaymentDetailValues";
import { cache } from "@/cache/cache";
import { useEditForm } from "@/hooks/useEditForm";

export default function PaymentEdit() {
    const {
        backUrl,
        isLoaded,
        isSaving,
        register,
        control,
        setValue,
        getValues,
        errors,
        handleSubmit,
    } = useEditForm(
        
        "Payment",

        async (id: number) => {
            const model = await restClient.payments.get(id);
            return modelToPaymentDetailValues(model);
        },

        async (id: number, values: PaymentDetailValues) => {
            const model = paymentDetailValuesToModel(values);

            await restClient.payments.update(id, model);
            
            cache.onPaymentChanged(id, values.categoryName.value, values.companyName.value);
        }
    );

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <PaymentDetail
                isLoaded={isLoaded}
                isSaving={isSaving}
                backUrl={backUrl}
                register={register}
                control={control}
                setValue={setValue}
                getValues={getValues}
                errors={errors}
            />
        </form>
    );
}