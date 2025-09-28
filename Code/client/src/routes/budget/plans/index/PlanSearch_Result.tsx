import { useLocation } from "react-router";
import { GridColumn } from "@/components/Grid";
import SearchResult from "@/components/search/SearchResult";
import EditCol from "@/components/fields/EditCol";
import { apiDateFormatType } from "@/api/restClient";
import { dateHelper } from "@/helpers/date/dateHelper";
import AmountField from "@/components/fields/AmountField";
import Icon from "@/components/Icon";
import { PlanRow } from "./PlanRow";
import { numberHelper } from "@/helpers/numberHelper";

const _columns: GridColumn[] = [
    { },
    { className: "text-start", title: "Date Range" },
    { className: "text-start", title: "Company" },
    { className: "text-start", title: "Description" },
    { className: "text-start", title: "Category" },
    { className: "text-start", title: "Wallet" },
    { className: "text-end", title: "Amount" },
];

export default function PaymentSearch_Result() {
    const location = useLocation();

    let baseUrl = location.pathname;
    if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
    }

    return (
        <SearchResult<PlanRow> columns={_columns}>
            {p => (
                <tr key={p.planPaymentId} className={p.isSelected ? "font-semibold" : ""}>
                    <EditCol
                        editUrl={`${baseUrl}${p.planPaymentId}`}
                        deleteUrl={`${baseUrl}${p.planPaymentId}/delete`}
                    />
                    <td className="text-nowrap">
                        <div className="flex">
                            <Icon
                                icon="bell"
                                className={p.isActiveAndInDate ? "text-green-400" : "text-gray-400"}
                                title={p.isActiveAndInDate ? "Active" : "Inactive"}
                            />
                            <span className="ms-3">
                                {getPaymentDateRange(p.paymentStartDate, p.paymentEndDate)}
                                <span className="text-description-text text-xs ms-1">
                                    #{p.planPaymentId}
                                </span>
                            </span>
                        </div>
                    </td>
                    <td>{p.companyName}</td>
                    <td>{p.description}</td>
                    <td>
                        {p.categoryName}
                        {p.taxYear && (
                            <div className="text-description-text text-xs">Tax Year: {p.taxYear}</div>
                        )}
                    </td>
                    <td>
                        {p.walletName}
                    </td>
                    <td className="text-nowrap text-end">
                        <div className="flex justify-between">
                            <span>
                                {p.taxable && <Icon icon="calculator" className="text-orange-400" title="Taxable" />}
                            </span>
                            <span>
                                <AmountField amount={numberHelper.fromServerDecimal(p.value)} format={p.valueFormat} highlight="income" />
                            </span>
                        </div>
                    </td>
                </tr>
            )}
        </SearchResult>
    );
}

function getPaymentDateRange(startDate: string, endDate: string | undefined | null) {
    const startDateFormatted = dateHelper.format(dateHelper.parse(startDate, apiDateFormatType), "mmm d, yyyy");
    const endDateFormatted = endDate && dateHelper.format(dateHelper.parse(endDate, apiDateFormatType), "mmm d, yyyy");

    return endDateFormatted
        ? `${startDateFormatted} - ${endDateFormatted}`
        : startDateFormatted;
}