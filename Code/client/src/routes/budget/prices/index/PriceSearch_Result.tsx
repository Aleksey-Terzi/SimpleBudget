import { GridColumn } from "@/components/Grid";
import SearchResult from "@/components/search/SearchResult";
import { PriceRow } from "./PriceRow";
import { dateHelper } from "@/helpers/date/dateHelper";
import { apiDateFormatType } from "@/api/restClient";
import AmountField from "@/components/fields/AmountField";
import EditCol from "@/components/fields/EditCol";
import { numberHelper } from "@/helpers/numberHelper";

const _columns: GridColumn[] = [
    { },
    { className: "text-start", title: "Date" },
    { className: "text-start", title: "Product" },
    { className: "text-start", title: "Company" },
    { className: "text-start", title: "Category" },
    { className: "text-start", title: "Description" },
    { className: "text-center", title: "Discount" },
    { className: "text-end", title: "Price Per Unit" },
    { className: "text-end", title: "Qty" },
];

export default function PriceSearch_Result() {
    return (
        <SearchResult<PriceRow> columns={_columns}>
            {p => (
                <tr
                    key={p.productPriceId}
                    className={p.isSelected ? "font-semibold" : ""}
                >
                    <EditCol
                        editUrl={`/budget/prices/${p.productPriceId}`}
                        deleteUrl={`/budget/prices/${p.productPriceId}/delete`}
                    />
                    <td className="text-nowrap">
                        {dateHelper.format(dateHelper.parse(p.priceDate, apiDateFormatType), "mmm d, yyyy")}
                    </td>
                    <td>{p.productName}</td>
                    <td>{p.companyName}</td>
                    <td>{p.categoryName}</td>
                    <td>{p.description}</td>
                    <td className="text-center">{p.isDiscount && "Yes"}</td>
                    <td className="text-nowrap text-end">
                        <AmountField amount={numberHelper.fromServerDecimal(p.price)} format={p.format} />
                    </td>
                    <td className="text-end">
                        {p.quantity}
                    </td>
                </tr>
            )}
        </SearchResult>
    );
}