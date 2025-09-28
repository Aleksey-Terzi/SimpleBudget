import Grid from "@/components/Grid";
import { numberHelper } from "@/helpers/numberHelper";
import { useEffect, useState } from "react";
import { TestPayment, TestPaymentFilter, testApiHelper } from "./testApiHelper";
import { useLoadingProvider } from "@/contexts/LoadingProvider";
import Tabs from "@/components/tabs/Tabs";
import Tab from "@/components/tabs/Tab";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
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

export default function TestGrid() {
    const [pageIndex, setPageIndex] = useState(-1);
    const [filter, setFilter] = useState<TestPaymentFilter>({ keyword: null, amountStart: null, amountEnd: null });
    const [totalRowCount, setTotalRowCount] = useState(0);
    const [dataState, setDataState] = useState<DataState>({ pageIndex: -1, filter: null, rows: null });
    const { addLoading, removeLoading } = useLoadingProvider();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTabKey, setSelectedTabKey] = useState("data");

    const { register, control, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            keyword: "",
            amountStart: null,
            amountEnd: null,
        }
    })

    useEffect(() => {
        async function run() {
            addLoading();

            const filter = { keyword: null, amountStart: null, amountEnd: null };
            const totalRowCount = await testApiHelper.countPayments(filter);
            const payments = await testApiHelper.searchPayments(filter, 0, 15);

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
            const payments = await testApiHelper.searchPayments(filter, pageIndex * 15, 15);

            console.log("searching:", filter);

            setTotalRowCount(totalRowCount);
            setDataState({ pageIndex: pageIndex, filter, rows: payments });
            setSelectedTabKey("data");
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
        <Tabs selectedTabKey={selectedTabKey} onSelect={tabKey => setSelectedTabKey(tabKey)}>
            <Tab tabKey="data" title="Data" icon="data" className="mt-4">
                <Grid
                    columns={[
                        { className: "text-start", title: "Date" },
                        { className: "text-start", title: "Wallet" },
                        { className: "text-end", title: "Amount" },
                    ]}
                    pageIndex={dataState.pageIndex}
                    totalRowCount={totalRowCount}
                    pagesPerView={3}
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
            </Tab>
            <Tab tabKey="search" title="Search" icon="search" className="mt-4">
                <form onSubmit={handleSubmit(handleValidSubmit)} autoComplete="off" className="grid grid-cols-2">
                    <div>
                        <FormField label="Keyword">
                            <TextInput
                                {...register("keyword")}
                                disabled={isLoading}
                            />
                        </FormField>
                        <FormField label="Amount">
                            <div className="flex gap-2 items-center">
                                <ControlledDecimalInput
                                    control={control}
                                    name="amountStart"
                                    className="w-full"
                                    disabled={isLoading}
                                />
                                to
                                <ControlledDecimalInput
                                    control={control}
                                    name="amountEnd"
                                    className="w-full"
                                    disabled={isLoading}
                                />
                            </div>
                        </FormField>

                        <Button variant="search" isLoading={isLoading} />
                    </div>
                </form>
            </Tab>
        </Tabs>
    );
}