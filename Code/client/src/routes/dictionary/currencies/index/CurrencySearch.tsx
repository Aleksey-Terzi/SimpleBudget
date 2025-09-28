import { apiDateFormatType, restClient } from "@/api/restClient";
import { useDictionarySearch } from "@/hooks/useDictionarySearch";
import FormSection from "@/components/form/FormSection";
import { CurrencyRow } from "./CurrencyRow";
import { dateHelper } from "@/helpers/date/dateHelper";
import CurrencySearch_Grid from "./CurrencySearch_Grid";

export default function CurrencySearch() {
    const { model } = useDictionarySearch("currencies", async (): Promise<CurrencyRow[]> => {
        const apiRows = await restClient.currencies.all();
        return apiRows.map(row => ({
            currencyId: row.currencyId,
            code: row.code,
            valueFormat: row.valueFormat,
            marketStartDate: dateHelper.parse(row.marketStartDate, apiDateFormatType),
            marketRate: row.marketRate ?? null,
            bankStartDate: dateHelper.parse(row.bankStartDate, apiDateFormatType),
            bankRate: row.bankRate ?? null,
        }));
    });

    return (
        <FormSection>
            <CurrencySearch_Grid items={model} />
        </FormSection>
    );
}