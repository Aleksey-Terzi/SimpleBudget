import FormSection from "@/components/form/FormSection";
import Search, { SearchContextData } from "@/components/search/Search";
import { PriceCriteria, priceCriteriaToFilter } from "./PriceCriteria";
import { PriceRow } from "./PriceRow";
import PriceSearch_Criteria from "./PriceSearch_Criteria";
import PriceSearch_Result from "./PriceSearch_Result";
import { restClient } from "@/api/restClient";

export default function PriceSearch() {
    return (
        <FormSection>
            <Search<PriceCriteria, PriceRow>
                storageKey="price"
                defaultCriteria={{
                    id: null,
                    keyword: "",
                }}
                onLoad={load}
            >
                <div className="max-w-[24rem]">
                    <PriceSearch_Criteria />
                </div>
                <PriceSearch_Result />
            </Search>
        </FormSection>
    );   
}

async function load(
    pageIndex: number,
    filter: PriceCriteria,
    contextData: SearchContextData<PriceCriteria, PriceRow> | null
) {
    const apiFilter = priceCriteriaToFilter(pageIndex, filter, contextData !== null);
    const [{ items, valueFormat }, pagination] = await restClient.productPrices.search(apiFilter);

    const rows: PriceRow[] = items.map(p => ({
        ...p,
        format: valueFormat,
        isSelected: p.productPriceId === filter?.id,        
    }));

    return {
        pageIndex: pagination.page - 1,
        rows,
        totalRowCount: pagination.totalItems,
        rowsPerPage: pagination.pageSize,
    };
}