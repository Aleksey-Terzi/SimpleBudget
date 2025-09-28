import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { restClient } from "@/api/restClient";
import Button from "@/components/Button";
import FormSection from "@/components/form/FormSection";
import { numberHelper } from "@/helpers/numberHelper";
import { useLoadAction } from "@/hooks/useLoadAction";
import { modelToTaxEditValues, TaxEditValues, taxEditValuesToModel } from "./TaxEditValues";
import TaxEdit_Settings from "./TaxEdit_Settings";
import { useSaveAction } from "@/hooks/useSaveAction";
import TaxEdit_Rates from "./TaxEdit_Rates";
import { useToast } from "@/contexts/ToastProvider";
import { cache } from "@/cache/cache";
import { useEffect } from "react";
import { useStatusProvider } from "@/contexts/StatusProvider";
import { useMenuProvider } from "@/contexts/MenuProvider";

export default function TaxEdit() {
    const navigate = useNavigate();

    const params = useParams();
    const year = numberHelper.parseInt(params["year"]) ?? new Date().getFullYear();

    const [searchParams] = useSearchParams();
    const fromYear = numberHelper.parseInt(searchParams.get("from"));

    const { isLoaded, runLoad } = useLoadAction(async () => {
        const loadFromYear = fromYear !== null ? fromYear : year;
        const model = await restClient.taxSettings.get(loadFromYear);
        return modelToTaxEditValues(model);
    });
    
    const { isSaving, runSave } = useSaveAction();
    const { showToast } = useToast();
    const { addStatus } = useStatusProvider();
    const { addMenu } = useMenuProvider();

    const { control, handleSubmit } = useForm<TaxEditValues>({
        defaultValues: runLoad
    });

    useEffect(() => {
        if (fromYear !== null && fromYear !== year) {
            addStatus("warning", `Settings copied from year ${fromYear}`);
        }
    }, [addStatus, year, fromYear]);

    useEffect(() => {
        addMenu({
            text: "Delete Tax Settings",
            icon: "trash",
            onClick: handleDelete,
        });

        async function handleDelete() {
            if (!window.confirm(`Are you sure to delete tax setting for year ${year}?`)) {
                return;
            }

            if (!await runSave(() => restClient.taxSettings.del(year))) {
                return;
            }

            showToast(`Tax settings for ${year} year were deleted`, "info");

            cache.onDictionaryChanged("dictionary-taxes");

            navigate("/dictionary/taxes");
        }
    }, [addMenu, showToast, runSave, navigate, year]);

    async function handleSave(values: TaxEditValues) {
        const model = taxEditValuesToModel(values);

        if (!await runSave(() => restClient.taxSettings.update(year, model))) {
            return;
        }

        showToast(`Tax settings for ${year} year were saved`, "info");

        cache.onDictionaryChanged("dictionary-taxes");

        navigate("/dictionary/taxes");
    }

    return (
        <FormSection>
            <form
                autoComplete="off"
                className="w-fit"
                onSubmit={handleSubmit(handleSave)}
            >
                <div className="grid grid-cols-[auto,1fr,1fr] gap-3">
                    <TaxEdit_Settings
                        year={year}
                        isDisabled={!isLoaded || isSaving}
                        control={control}
                    />
                    <TaxEdit_Rates
                        isDisabled={!isLoaded || isSaving}
                        control={control}
                        collectionName="federalTaxRates"
                        title="Federal Tax Rates"
                    />
                    <TaxEdit_Rates
                        isDisabled={!isLoaded || isSaving}
                        control={control}
                        collectionName="provincialTaxRates"
                        title="Provincial Tax Rates"
                    />
                </div>

                <div className="flex gap-1 mt-6">
                    <Button
                        variant="submit"
                        disabled={!isLoaded}
                        isLoading={isSaving}
                    />
                    <Button
                        variant="cancel"
                        href="/dictionary/taxes"
                    />
                </div>
            </form>
        </FormSection>
    );
}