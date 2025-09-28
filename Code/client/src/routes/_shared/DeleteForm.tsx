import { useLocation, useNavigate, useParams } from "react-router";
import { formRouteHelper } from "../formRouteHelper";
import { ReactNode, useEffect, useState } from "react";
import { useStatusProvider } from "@/contexts/StatusProvider";
import { useToast } from "@/contexts/ToastProvider";
import { useLoadingProvider } from "@/contexts/LoadingProvider";
import { stringHelper } from "@/helpers/stringHelper";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import NoneOrValue from "./NoneOrValue";
import Button from "@/components/Button";

interface Field {
    label: string;
    value: ReactNode;
}

interface WithAllowDelete {
    fields: Field[];
    allowDelete: boolean;
}

interface Props {
    entityName: string,
    onLoad: (id: number) => Promise<Field[] | WithAllowDelete>,
    onDelete: (id: number) => Promise<void>,
}

export default function DeleteForm({
    entityName,
    onLoad,
    onDelete
}: Props) {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const id = Number(params["id"]);
    const backUrl = formRouteHelper.getParentUrl(location.pathname, params)!;
    const grandParentUrl = formRouteHelper.getGrandParentUrl(location.pathname, params);

    const [fields, setFields] = useState<Field[] | null>(null);
    const [allowDeleted, setAllowDelete] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const { addError } = useStatusProvider();
    const { showToast } = useToast();
    const { addLoading, removeLoading } = useLoadingProvider();

    async function handleDelete() {
        if (!window.confirm(`Are you sure to delete this ${entityName}?`)) {
            return;
        }

        setIsDeleting(true);

        try {
            await onDelete(id);
        } catch (err) {
            addError(err, `Failed to delete ${entityName}`);
            return;
        } finally {
            setIsDeleting(false);
        }

        showToast(`${stringHelper.uppercaseFirstLetter(entityName)} #${id} was deleted`, "info");

        const afterDeleteUrl = !grandParentUrl || !location.pathname.startsWith(backUrl) ? backUrl : grandParentUrl;

        navigate(afterDeleteUrl);
    }

    useEffect(() => {
        async function run() {
            addLoading();

            try {
                const loadResult = await onLoad(id);
                if (Array.isArray(loadResult)) {
                    setFields(loadResult);
                } else {
                    setFields(loadResult.fields);
                    setAllowDelete(loadResult.allowDelete);
                }
            } catch (err) {
                addError(err, `Failed to load ${entityName}`);
            } finally {
                removeLoading();
            }
        }
        run();
    }, [addLoading, removeLoading, addError, onLoad, id, entityName]);

    return (
        <FormSection>
            <div className="max-w-[36rem]">
                {fields && fields.map(({ label, value }, index) => (
                    <FormField key={index} label={label}>
                        <NoneOrValue s={value} />
                    </FormField>
                ))}
            </div>
            <div className="flex gap-1 mt-6">
                <Button
                    variant="submit"
                    disabled={!fields || !allowDeleted}
                    isLoading={isDeleting}
                    loadingText="Deleting..."
                    icon="trash"
                    type="button"
                    onClick={handleDelete}
                >
                    Delete
                </Button>
                <Button
                    variant="cancel"
                    disabled={!fields || isDeleting}
                    href={backUrl}
                />
            </div>
        </FormSection>
    );

}