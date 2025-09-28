import { ChangeEvent, useEffect, useState } from "react";
import { SummaryModel } from "@/api/models/SummaryModel";
import { restClient } from "@/api/restClient";
import { cache } from "@/cache/cache";
import { storageHelper } from "@/helpers/storageHelper";
import { useStatusProvider } from "@/contexts/StatusProvider";
import FormSection from "@/components/form/FormSection";
import { useLoadingProvider } from "@/contexts/LoadingProvider";
import CheckInput from "@/components/inputs/CheckInput";
import SummaryReport_Wallet from "./SummaryReport_Wallet";
import SummaryReport_Currency from "./SummaryReport_Currency";

export default function SummaryReport() {
    const [report, setReport] = useState<SummaryModel | null>(() => cache.report.get<SummaryModel>("summary"));
    const [deductTaxes, setDeductTaxes] = useState(() => storageHelper.get("reports", "summary", "deductTaxes") === "1");

    const { addLoading, removeLoading } = useLoadingProvider();
    const { addError } = useStatusProvider();

    useEffect(() => {
        if (report) {
            return;
        }

        const newReport = cache.report.get("summary", restClient.reports.summary)

        if (newReport instanceof Promise) {
            addLoading();

            newReport
                .then(result => setReport(result))
                .catch(err => addError(err, "Failed to load Summary report"))
                .finally(() => removeLoading());
        } else {
            setReport(newReport);
        }

    }, [addLoading, removeLoading, addError, report]);

    function handleDeductTaxesChange(e: ChangeEvent<HTMLInputElement>) {
        setDeductTaxes(e.target.checked);
        storageHelper.set("reports", "summary", "deductTaxes", e.target.checked ? "1" : null);
    }

    return (
        <FormSection>
            {report ? (
                <>
                    <div className="grid grid-cols-[3fr,2fr] gap-6 mb-6">
                        <SummaryReport_Wallet
                            taxCAD={report.taxCAD}
                            valueFormatCAD={report.valueFormatCAD}
                            wallets={report.wallets}
                            deductTaxes={deductTaxes}
                        />
                        <SummaryReport_Currency
                            taxCAD={report.taxCAD}
                            valueFormatCAD={report.valueFormatCAD}
                            currencies={report.currencies}
                            deductTaxes={deductTaxes}
                        />
                    </div>

                    <CheckInput
                        className="w-fit"
                        defaultSelected={deductTaxes}
                        onChange={handleDeductTaxesChange}
                    >
                        Deduct unpaid taxes
                    </CheckInput>
                </>
            ) : (
                <>Loading report...</>
            )}
        </FormSection>
    );
}