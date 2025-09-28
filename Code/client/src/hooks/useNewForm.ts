import { useLocation, useNavigate, useParams } from "react-router";
import { DefaultValues, useForm } from "react-hook-form";
import { useToast } from "@/contexts/ToastProvider";
import { formRouteHelper } from "@/routes/formRouteHelper";
import { useSaveAction } from "./useSaveAction";

export function useNewForm<FormValues extends object>(
    entityName: string,
    defaultValues: FormValues,
    onSave: (values: FormValues) => Promise<number>,
    redirectToEditUrl?: string,
) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const backUrl = formRouteHelper.getParentUrl(location.pathname, params)!;

    const { isSaving, runSave } = useSaveAction();
    
    const { showToast } = useToast();

    const { register, control, setValue, getValues, handleSubmit, formState: { errors } } = useForm({
        defaultValues: defaultValues as DefaultValues<FormValues>
    });

    async function handleSave(values: FormValues) {
        let id: number;

        if (!await runSave(async () => id = await onSave(values))) {
            return;
        }

        showToast(`${entityName} #${id!} was created`, "info");

        const redirectTo = redirectToEditUrl ? redirectToEditUrl + String(id!) : backUrl;

        navigate(redirectTo);
    }

    return {
        backUrl,
        isSaving,
        register,
        control,
        setValue,
        getValues,
        errors,
        handleSubmit: handleSubmit(handleSave),
    };
}