import { useEffect, useState } from "react";
import { MonthlyModel } from "@/api/models/MonthlyModel";
import MonthComboBox from "@/routes/_shared/MonthComboBox";
import { cache } from "@/cache/cache";
import FormSection from "@/components/form/FormSection";
import ComboBox from "@/components/inputs/combobox/ComboBox";
import { useLoadingProvider } from "@/contexts/LoadingProvider";
import { useStatusProvider } from "@/contexts/StatusProvider";
import { restClient } from "@/api/restClient";
import { ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";
import LoadingOverlay from "@/components/LoadingOverlay";
import MonthlyReport_Category from "./MonthlyReport_Category";
import MonthlyReport_Wallet from "./MonthlyReport_Wallet";
import MonthlyReport_Summary from "./MonthlyReport_Summary";
import { numberHelper } from "@/helpers/numberHelper";

interface ReportDate {
    year: number;
    month: number;
}

export default function MonthlyReport() {
    const [report, setReport] = useState<MonthlyModel | null>(() => cache.report.get<MonthlyModel>("monthly"));
    const [isLoading, setIsLoading] = useState(false);

    const { addLoading, removeLoading } = useLoadingProvider();
    const { addError, removeError } = useStatusProvider();

    useEffect(() => {
        if (report) {
            return;
        }

        const date = cache.report.get<ReportDate>("monthly-date");
        const newReport = cache.report.get("monthly", async () => restClient.reports.monthly(date?.year ?? null, date?.month ?? null));

        if (newReport instanceof Promise) {
            addLoading();

            newReport
                .then(result => setReport(result))
                .catch(err => addError(err, "Failed to load Monthly report"))
                .finally(() => removeLoading());
        } else {
            setReport(newReport);
        }

    }, [addLoading, removeLoading, addError, report]);

    async function reloadReport(year: number, month: number) {
        if (report!.selectedYear === year && report!.selectedMonth === month) {
            return;
        }

        cache.report.delete("monthly");

        setIsLoading(true);
        
        try {
            const newReport = await cache.report.get("monthly", () => restClient.reports.monthly(year, month));
            cache.report.set("monthly-date", {
                year: newReport.selectedYear,
                month: newReport.selectedMonth,
            });
            setReport(newReport);
            removeError();
        } catch (err) {
            addError(err, "Failed to load Monthly report");
        } finally {
            setIsLoading(false);
        }
    }

    function handleChangeYear(selectedValue: ComboBoxValue) {
        reloadReport(parseInt(selectedValue.value!), report!.selectedMonth);
    }

    function handleChangeMonth(selectedValue: ComboBoxValue) {
        reloadReport(report!.selectedYear, parseInt(selectedValue.value!));
    }

    return (
        <FormSection>
            {report ? (
                <>
                    <div className="flex gap-3 mb-3">
                        <div className="flex items-center gap-1">
                            Year:
                            <ComboBox
                                className="w-36"
                                disabled={isLoading}
                                onlySelect={true}
                                defaultValue={{ value: String(report.selectedYear), type: "selected" }}
                                items={report.years.map(year => ({
                                    value: String(year),
                                    text: String(year),
                                }))}
                                onChange={handleChangeYear}
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            Month:
                            <MonthComboBox
                                className="w-36"
                                disabled={isLoading}
                                defaultValue={{ value: String(report.selectedMonth), type: "selected" }}
                                onChange={handleChangeMonth}
                            />
                        </div>
                    </div>
                    <LoadingOverlay isLoading={isLoading}>
                        <div className="grid grid-cols-2 gap-6">
                            <MonthlyReport_Category
                                year={report.selectedYear}
                                month={report.selectedMonth}
                                showWeekly={report.showWeekly}
                                categories={report.categories}
                                format={report.valueFormatCAD}
                                balanceDiff={numberHelper.fromServerDecimal(report.summaries.reduce((a, b) => a + b.currentCAD - b.beginningCAD, 0))}
                            />
                            <div className="flex flex-col gap-3">
                                <MonthlyReport_Wallet wallets={report.wallets} formatCAD={report.valueFormatCAD} />
                                <MonthlyReport_Summary summaries={report.summaries} formatCAD={report.valueFormatCAD} />
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