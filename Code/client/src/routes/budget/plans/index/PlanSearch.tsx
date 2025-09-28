import FormSection from "@/components/form/FormSection";
import Search, { SearchContextData } from "@/components/search/Search";
import { PlanCriteria, planCriteriaToFilter } from "./PlanCriteria";
import { PlanRow } from "./PlanRow";
import PlanSearch_Criteria from "./PlanSearch_Criteria";
import PlanSearchResult from "./PlanSearch_Result";
import { restClient } from "@/api/restClient";
import { searchHelper } from "@/components/search/searchHelper";

export default function PlanSearch() {
    return (
        <FormSection>
            <Search<PlanCriteria, PlanRow>
                storageKey="plan"
                defaultCriteria={{
                    id: null,
                    keyword: null,
                }}
                onLoad={load}
            >
                <div className="max-w-[24rem]">
                    <PlanSearch_Criteria />
                </div>
                <PlanSearchResult />
            </Search>
        </FormSection>
    );   
}

async function load(
    pageIndex: number,
    criteria: PlanCriteria,
    contextData: SearchContextData<PlanCriteria, PlanRow> | null
) {
    const apiFilter = planCriteriaToFilter(pageIndex, criteria, contextData !== null);
    const [apiRows, pagination] = await restClient.planPayments.search(apiFilter);

    return searchHelper.toSearchResult(apiRows, pagination, p => ({
        planPaymentId: p.planPaymentId,
        paymentStartDate: p.paymentStartDate,
        paymentEndDate: p.paymentEndDate,
        companyName: p.companyName,
        description: p.description,
        categoryName: p.categoryName,
        walletName: p.walletName,
        personName: p.personName,
        valueFormat: p.valueFormat,
        value: p.value,
        taxable: p.taxable,
        taxYear: p.taxYear,
        isActive: p.isActive,
        isActiveAndInDate: p.isActiveAndInDate,
        isSelected: p.planPaymentId === criteria?.id,
    }));
}