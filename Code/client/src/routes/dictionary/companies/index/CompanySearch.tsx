import { restClient } from "@/api/restClient";
import { useDictionarySearch } from "@/hooks/useDictionarySearch";
import FormSection from "@/components/form/FormSection";
import { CompanyRow } from "./CompanyRow";
import CompanySearch_Grid from "./CompanySearch_Grid";

export default function CompanySearch() {
    const { model } = useDictionarySearch("companies", async (): Promise<CompanyRow[]> => {
        const apiRows = await restClient.companies.all();
        return apiRows.map(row => ({
            companyId: row.companyId,
            name: row.name,
            paymentCount: row.paymentCount,
        }));
    });

    return (
        <FormSection>
            <CompanySearch_Grid items={model} />
        </FormSection>
    );
}