import { TaxModel } from "@/api/models/TaxModel";
import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import FormSection from "@/components/form/FormSection";
import ComboBox from "@/components/inputs/combobox/ComboBox";
import { ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";
import { useStatusProvider } from "@/contexts/StatusProvider";
import { useLoadingProvider } from "@/contexts/LoadingProvider";
import { useEffect, useState } from "react";
import Taxes_Income from "./Taxes_Income";
import Taxes_Items from "./Taxes_Items";
import Button from "@/components/Button";
import LoadingOverlay from "@/components/LoadingOverlay";

interface PersonAndYear {
    personId: number | null;
    year: number | null;
}

export default function Taxes() {
    const [report, setReport] = useState<TaxModel | null>(() => cache.report.get<TaxModel>("taxes"));
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { addLoading, removeLoading } = useLoadingProvider();
    const { addError, removeError } = useStatusProvider();

    useEffect(() => {
        if (report) {
            return;
        }

        const { personId, year } = cache.report.get<PersonAndYear>("taxes-person-and-year") ?? { personId: null, year: null };
        const newReport = cache.report.get("taxes", async () => restClient.taxes.search(personId, year));

        if (newReport instanceof Promise) {
            addLoading();

            newReport
                .then(result => setReport(result))
                .catch(err => addError(err, "Failed to load taxes"))
                .finally(() => removeLoading());
        } else {
            setReport(newReport);
        }

    }, [addLoading, removeLoading, addError, report]);

    async function reloadReport(personId: number | null, year: number) {
        if (report!.selectedPersonId === personId && report!.selectedYear === year) {
            return;
        }

        cache.report.delete("taxes");

        setIsLoading(true);
        
        try {
            const newReport = await cache.report.get("taxes", async () => restClient.taxes.search(personId, year));
            cache.report.set("taxes-person-and-year", {
                personId: newReport.selectedPersonId,
                year: newReport.selectedYear,
            });
            setReport(newReport);
            removeError();
        } catch (err) {
            addError(err, "Failed to load taxes");
        } finally {
            setIsLoading(false);
        }
    }

    function handleChangePerson(selectedValue: ComboBoxValue) {
        reloadReport(parseInt(selectedValue.value!), report!.selectedYear);
    }

    function handleChangeYear(selectedValue: ComboBoxValue) {
        reloadReport(report!.selectedPersonId ?? null, parseInt(selectedValue.value!));
    }

    function handleCloseYear() {
        if (!report!.selectedPersonId) {
            return;
        }

        setIsSaving(true);

        restClient.taxes.close(report!.selectedPersonId, report!.selectedYear)
            .then(r => {
                setReport(r);
                removeError();
            }).catch(err => {
                addError(err, "Failed to close the year");
            }).finally(() => {
                setIsSaving(false);
            });
    }

    function handleOpenYear() {
        if (!report!.selectedPersonId) {
            return;
        }

        setIsSaving(true);

        restClient.taxes.open(report!.selectedPersonId, report!.selectedYear)
            .then(r => {
                setReport(r);
                removeError();
            }).catch(err => {
                addError(err, "Failed to close the year");
            }).finally(() => {
                setIsSaving(false);
            });
    }

    return (
        <FormSection>
            {report ? (
                <>
                    <div className="flex gap-3 mb-3">
                        <div className="flex items-center gap-1">
                            Person:
                            <ComboBox
                                className="w-36"
                                disabled={isLoading || isSaving}
                                onlySelect={true}
                                defaultValue={{ value: String(report.selectedPersonId), type: "selected" }}
                                items={report.persons.map(({ personId, name }) => ({
                                    value: String(personId),
                                    text: name,
                                }))}
                                onChange={handleChangePerson}
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            Year:
                            <ComboBox
                                className="w-36"
                                disabled={isLoading || isSaving}
                                onlySelect={true}
                                defaultValue={{ value: String(report.selectedYear), type: "selected" }}
                                items={report.years.map(year => ({
                                    value: String(year),
                                    text: String(year),
                                }))}
                                onChange={handleChangeYear}
                            />
                        </div>
                    </div>
                    <LoadingOverlay isLoading={isLoading}>
                        <div className="grid grid-cols-2 gap-6">
                            <Taxes_Income
                                incomes={report.incomes}
                                valueFormatCAD={report.valueFormatCAD}
                            />
                            <div className="flex flex-col gap-3">
                                <Taxes_Items
                                    taxItems={report.taxItems}
                                    incomes={report.incomes}
                                    valueFormatCAD={report.valueFormatCAD}
                                    closed={report.closed}
                                />
                                <div className="pt-4 flex justify-end">
                                    {!report.closed && (
                                        <Button
                                            type="button"
                                            icon="lock-closed"
                                            isLoading={isSaving}
                                            disabled={isLoading}
                                            loadingText="Closing Tax Year..."
                                            onClick={handleCloseYear}
                                        >
                                            Close Tax Year
                                        </Button>
                                    )}
                                    {report.closed && report.canOpen && (
                                        <Button
                                            type="button"
                                            icon="lock-open"
                                            isLoading={isSaving}
                                            disabled={isLoading}
                                            loadingText="Re-opening Tax Year..."
                                            onClick={handleOpenYear}
                                        >
                                            Re-open Tax Year
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </LoadingOverlay>
                </>
            ) : (
                <>Loading report...</>
            )}
        </FormSection>
    )
}