import SearchResult from "@/components/search/SearchResult";
import { PaymentRow } from "./PaymentRow";
import { GridColumn } from "@/components/Grid";
import { useLocation } from "react-router";
import PaymentSearch_ResultSum from "./PaymentSearch_ResultSum";
import PaymentSearch_ResultRow from "./PaymentSearch_ResultRow";

const _columns: GridColumn[] = [
    { },
    { className: "text-start", title: "Date" },
    { className: "text-start", title: "Company" },
    { className: "text-start", title: "Description" },
    { className: "text-start", title: "Category" },
    { className: "text-start", title: "Wallet" },
    { className: "text-start", title: "Person" },
    { className: "text-end", title: "Amount" },
];

export default function PaymentSearch_Result() {
    const location = useLocation();

    let baseUrl = location.pathname;
    if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
    }

    return (
        <SearchResult<PaymentRow> columns={_columns}>
            {p => p.isSum ? (
                <PaymentSearch_ResultSum key="Sum" p={p} colSpan={_columns.length} />
            ) : (
                <PaymentSearch_ResultRow key={p.paymentId} baseUrl={baseUrl} p={p} />
            )}
        </SearchResult>
    );
}