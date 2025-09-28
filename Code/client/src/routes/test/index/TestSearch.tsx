import { useForm } from "react-hook-form";
import { useState } from "react";
import { TestPayment, TestPaymentFilter, testApiHelper } from "./testApiHelper";
import Search, { useSearch } from "@/components/search/Search";
import SearchCriteria from "@/components/search/SearchCriteria";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import SearchResult from "@/components/search/SearchResult";
import SearchCriteriaButtons from "@/components/search/SearchCriteriaButtons";
import { numberHelper } from "@/helpers/numberHelper";
import Button from "@/components/Button";
import { dateHelper } from "@/helpers/date/dateHelper";
import ControlledDecimalInput from "@/components/inputs/numeric/ControlledDecimalInput";

async function loadPayments(pageIndex: number, filter: TestPaymentFilter | null) {
    if (!filter) {
        filter = {
            keyword: null,
            amountStart: null,
            amountEnd: null,
        };
    }

    const totalRowCount = await testApiHelper.countPayments(filter);
    const rowsPerPage = 3;

    if (pageIndex < 0) {
        pageIndex = 0;
    } else {
        const pageCount = Math.floor((totalRowCount - 1) / rowsPerPage) + 1;
        if (pageIndex >= pageCount) {
            pageIndex = pageCount > 0 ? pageCount - 1 : 0;
        }
    }

    const rows = await testApiHelper.searchPayments(filter, pageIndex * rowsPerPage, rowsPerPage);

    return {
        pageIndex,
        rows,
        totalRowCount,
        rowsPerPage
    }
}

export default function TestSearch() {
    const [visible, setVisible] = useState(true);
    return (
        <>
            {visible && (
                <Search<TestPaymentFilter, TestPayment>
                    storageKey="test"
                    defaultCriteria={{
                        keyword: "",
                        amountStart: 0,
                        amountEnd: 0,
                    }}
                    onLoad={loadPayments}
                >
                    <PaymentSearchCriteria />
                    <PaymentSearchResult />
                </Search>
            )}

            <Button className="mt-3" onClick={() => setVisible(!visible)}>
                Hide / Show
            </Button>
        </>
    );
}

function PaymentSearchCriteria() {
    const { criteria, defaultCriteria, isLoading, setCriteria } = useSearch<TestPaymentFilter, object>();

    const { register, control, reset, setFocus, handleSubmit } = useForm<TestPaymentFilter>({
        defaultValues: criteria
    });

    return (
        <SearchCriteria onShow={() => setFocus("keyword")}>
            <form autoComplete="off" onSubmit={handleSubmit(setCriteria)} className="grid grid-cols-2">
                <div>
                    <FormField label="Keyword">
                        <TextInput
                            {...register("keyword")}
                            maxLength={20}
                            readOnly={isLoading}
                        />
                    </FormField>
                    <FormField label="Amount">
                        <div className="flex gap-2 items-center">
                            <ControlledDecimalInput
                                control={control}
                                name="amountStart"
                                className="w-full"
                                readOnly={isLoading}
                            />
                            to
                            <ControlledDecimalInput
                                control={control}
                                name="amountEnd"
                                className="w-full"
                                readOnly={isLoading}
                            />
                        </div>
                    </FormField>

                    <SearchCriteriaButtons isLoading={isLoading} onClear={() => reset(defaultCriteria)} />
                </div>
            </form>
        </SearchCriteria>
    );
}

function PaymentSearchResult() {
    return (
        <SearchResult<TestPayment> columns={[
            { className: "text-start", title: "Date" },
            { className: "text-start", title: "Wallet" },
            { className: "text-end", title: "Amount" },
        ]}>
            {({ id, date, wallet, amount }) => (
                <tr key={id}>
                    <td>
                        {dateHelper.format(dateHelper.parse(date), "mmm d, yyyy")}
                    </td>
                    <td>{wallet}</td>
                    <td className="text-end">{numberHelper.formatCurrency(amount)}</td>
                </tr>
            )}
        </SearchResult>
    );
}