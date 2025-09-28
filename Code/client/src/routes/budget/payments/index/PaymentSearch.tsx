import { useLocation, useParams } from "react-router";
import Search, { SearchContextData } from "@/components/search/Search";
import { defaultPaymentCriteria, PaymentCriteria, paymentCriteriaToFilter } from "./PaymentCriteria";
import PaymentSearch_Criteria from "./PaymentSearch_Criteria";
import PaymentSearch_Result from "./PaymentSearch_Result";
import { restClient } from "@/api/restClient";
import FormSection from "@/components/form/FormSection";
import { PaymentRow } from "./PaymentRow";
import { PaymentFilterModel } from "@/api/models/PaymentFilterModel";
import PaymentSearch_TypeButtons from "./PaymentSearch_TypeButtons";
import { SearchStorageKey } from "@/helpers/enums";
import Button from "@/components/Button";
import { formRouteHelper } from "@/routes/formRouteHelper";
import { searchHelper } from "@/components/search/searchHelper";

interface Props {
    storageKey: SearchStorageKey;
    allowFiltering: boolean;
}

export default function PaymentSearch({ storageKey, allowFiltering }: Props) {
    const location = useLocation();
    const params = useParams();

    return (
        <FormSection>
            <Search<PaymentCriteria, PaymentRow>
                storageKey={storageKey}
                defaultCriteria={defaultPaymentCriteria}
                onLoad={load}
            >
                {allowFiltering ? (
                    <div className="flex items-start gap-3">
                        <PaymentSearch_Criteria />
                        <div className="mt-0.5 flex gap-3">
                            <PaymentSearch_TypeButtons />
                        </div>
                    </div>
                ) : (
                    <Button
                        icon="arrow-uturn-left"
                        className="w-fit"
                        href={formRouteHelper.getParentUrl(location.pathname, params)}
                    >
                        Back
                    </Button>
                )}
                <PaymentSearch_Result />
            </Search>
        </FormSection>
    );   
}

async function load(
    pageIndex: number,
    criteria: PaymentCriteria,
    contextData: SearchContextData<PaymentCriteria, PaymentRow> | null
) {
    const apiFilter = paymentCriteriaToFilter(pageIndex, criteria, contextData !== null);
    const [apiRows, pagination] = await restClient.payments.search(apiFilter);

    const sumRow = apiRows.length === 0
        ? null
        : !contextData?.rows || contextData.criteria !== criteria || contextData.rows.length === 0 || !contextData.rows[0].isSum
            ? await createSumRow(apiFilter)
            : contextData.rows[0];

    return searchHelper.toSearchResult(apiRows, pagination, p => ({
        paymentId: p.paymentId,
        paymentDate: p.paymentDate,
        companyName: p.companyName,
        description: p.description,
        categoryName: p.categoryName,
        walletName: p.walletName,
        personName: p.personName,
        valueFormat: p.valueFormat,
        value: p.value,
        taxable: p.taxable,
        taxYear: p.taxYear,
        transferToPaymentId: p.transferTo?.paymentId,
        transferToValue: p.transferTo?.value,
        transferToValueFormat: p.transferTo?.valueFormat,
        transferToWalletName: p.transferTo?.walletName,
        isSelected: p.paymentId === criteria?.id,
        isSum: false,
    }), sumRow);
}

async function createSumRow(apiFilter: PaymentFilterModel): Promise<PaymentRow> {
    const { sum, valueFormat } = await restClient.payments.sum(apiFilter);
    return {
        paymentId: 0,
        paymentDate: "",
        companyName: null,
        description: null,
        categoryName: null,
        walletName: null,
        personName: null,
        valueFormat: valueFormat,
        value: sum,
        taxable: false,
        taxYear: null,
        transferToPaymentId: null,
        transferToValue: null,
        transferToValueFormat: null,
        transferToWalletName: null,
        isSelected: false,
        isSum: true,
    };
}
