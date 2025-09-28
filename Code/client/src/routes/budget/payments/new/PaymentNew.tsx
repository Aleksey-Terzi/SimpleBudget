import PaymentDetail from "../_shared/PaymentDetail";
import { defaultPaymentDetailValues, PaymentDetailValues, paymentDetailValuesToModel } from "../_models/PaymentDetailValues";
import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { useNewForm } from "@/hooks/useNewForm";

export default function PaymentNew() {
    const {
        backUrl,
        isSaving,
        register,
        control,
        setValue,
        getValues,
        errors,
        handleSubmit,
    } = useNewForm(

        "Payment",

        defaultPaymentDetailValues(),
        
        async (values: PaymentDetailValues) => {
            const model = paymentDetailValuesToModel(values);
            const id = await restClient.payments.create(model);
            
            cache.onPaymentChanged(id, values.categoryName.value, values.companyName.value);

            return id;
        }
    );

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <PaymentDetail
                isLoaded={true}
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