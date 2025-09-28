import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Grid from "@/components/Grid";
import { numberHelper } from "@/helpers/numberHelper";
import { TestPayment, TestPaymentFilter, testApiHelper } from "./testApiHelper";
import { useLoadingProvider } from "@/contexts/LoadingProvider";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import Button from "@/components/Button";
import ExpandablePanel from "@/components/ExpandablePanel";
import Icon from "@/components/Icon";
import { dateHelper } from "@/helpers/date/dateHelper";
import ControlledDecimalInput from "@/components/inputs/numeric/ControlledDecimalInput";

interface DataState {
    pageIndex: number;
    filter: TestPaymentFilter | null;
    rows: TestPayment[] | null;
}

interface FormValues {
    keyword: string;
    amountStart: number | null;
    amountEnd: number | null;
}

export default function TestGrid2() {
    const [pageIndex, setPageIndex] = useState(-1);
    const [filter, setFilter] = useState<TestPaymentFilter>({ keyword: null, amountStart: null, amountEnd: null });
    const [totalRowCount, setTotalRowCount] = useState(0);
    const [dataState, setDataState] = useState<DataState>({ pageIndex: -1, filter: null, rows: null });
    const { addLoading, removeLoading } = useLoadingProvider();
    const [isLoading, setIsLoading] = useState(false);

    const { register, control, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            keyword: "",
            amountStart: null,
            amountEnd: null,
        }
    });

    const myKeywordRef = useRef<HTMLInputElement | null>(null);
    const { ref: keywordRef, ...keywordRest } = register("keyword");

    useEffect(() => {
        async function run() {
            addLoading();

            const filter = { keyword: null, amountStart: null, amountEnd: null };
            const totalRowCount = await testApiHelper.countPayments(filter);
            const payments = await testApiHelper.searchPayments(filter, 0, 10);

            setPageIndex(0);
            setFilter(filter);
            setTotalRowCount(totalRowCount);
            setDataState({ pageIndex: 0, filter, rows: payments });

            removeLoading();
        };
        run();
    }, [addLoading, removeLoading]);

    useEffect(() => {
        if (pageIndex < 0 || pageIndex === dataState.pageIndex && filter === dataState.filter) {
            return;
        }

        setIsLoading(true);

        async function run () {
            const totalRowCount = await testApiHelper.countPayments(filter);
            const payments = await testApiHelper.searchPayments(filter, pageIndex * 10, 10);

            console.log("searching:", filter);

            setTotalRowCount(totalRowCount);
            setDataState({ pageIndex: pageIndex, filter, rows: payments });
            setIsLoading(false);
        }
        run();
    }, [pageIndex, filter, dataState.pageIndex, dataState.filter]);

    function handleValidSubmit(values: FormValues) {
        setFilter({
            keyword: values.keyword,
            amountStart: values.amountStart,
            amountEnd: values.amountEnd,
        });
        setPageIndex(0);
    }

    return (
        <>
            <ExpandablePanel title={(
                    <div className="flex items-center">
                        <Icon icon="search" className="me-2" />
                        Search
                    </div>
                )}
                defaultExpanded={false}
                onChange={expanded => {
                    if (expanded) {
                        myKeywordRef.current?.focus();
                    }
                }}
            >
                <form onSubmit={handleSubmit(handleValidSubmit)} autoComplete="off" className="grid grid-cols-2">
                    <div>
                        <FormField label="Keyword">
                            <TextInput
                                {...keywordRest}
                                ref={e => {
                                    keywordRef(e);
                                    myKeywordRef.current = e;
                                }}
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

                        <Button variant="search" isLoading={isLoading} />
                    </div>
                </form>
            </ExpandablePanel>

            <Grid
                className="mt-2"
                columns={[
                    { className: "text-start", title: "Date" },
                    { className: "text-start", title: "Wallet" },
                    { className: "text-end", title: "Amount" },
                ]}
                pageIndex={dataState.pageIndex}
                totalRowCount={totalRowCount}
                pagesPerView={3}
                rowsPerPage={10}
                isLoading={isLoading}
                onGoToPage={pageIndex => setPageIndex(pageIndex)}
            >
                {dataState.rows && (
                    dataState.rows.length > 0
                        ? (
                            dataState.rows.map(({ id, date, wallet, amount }) => (
                                <tr key={id}>
                                    <td>
                                        {dateHelper.format(dateHelper.parse(date), "mmm d, yyyy")}
                                    </td>
                                    <td>{wallet}</td>
                                    <td className="text-end">{numberHelper.formatCurrency(amount)}</td>
                                </tr>
                        ))): (
                            <tr>
                                <td colSpan={3}>
                                    <em>No Data</em>
                                </td>
                            </tr>
                        )
                )}
                {!dataState.rows && (
                    <tr>
                        <td colSpan={3}>
                            Data is loading...
                        </td>
                    </tr>
                )}
            </Grid>
        </>
    );
}