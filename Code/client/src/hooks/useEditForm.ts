import { useLocation, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useToast } from "@/contexts/ToastProvider";
import { formRouteHelper } from "@/routes/formRouteHelper";
import { useLoadAction } from "./useLoadAction";
import { useSaveAction } from "./useSaveAction";

export function useEditForm<FormValues extends object>(
    entityName: string,
    onLoad: (id: number) => Promise<FormValues>,
    onSave: (id: number, values: FormValues) => Promise<unknown>
) {
    const params = useParams();
    const id = Number(params["id"]);
    if (isNaN(id)) {
        throw new Error("ID is not provided");
    }

    const navigate = useNavigate();
    const location = useLocation();
    const backUrl = formRouteHelper.getParentUrl(location.pathname, params)!;

    const { isLoaded, runLoad } = useLoadAction(() => onLoad(id));
    const { isSaving, runSave } = useSaveAction();
    
    const { showToast } = useToast();

    const { register, control, setValue, getValues, handleSubmit, trigger, formState: { errors } } = useForm({
        defaultValues: runLoad
    });

    async function handleSave(values: FormValues) {
        if (!await runSave(() => onSave(id, values))) {
            return;
        }

        showToast(`${entityName} #${id} was updated`, "info");

        navigate(backUrl);
    }

    return {
        id,
        backUrl,
        isLoaded,
        isSaving,
        register,
        control,
        setValue,
        getValues,
        trigger,
        errors,
        handleSubmit: handleSubmit(handleSave),
    };
}