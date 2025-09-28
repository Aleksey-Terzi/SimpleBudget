import { Control, useFieldArray, UseFormRegister, UseFormTrigger } from "react-hook-form";
import FormTitle from "@/components/form/FormTitle";
import Grid from "@/components/Grid";
import ControlledDecimalInput from "@/components/inputs/numeric/ControlledDecimalInput";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import { CurrencyEditValues } from "./CurrencyEditValues";
import ControlledDateInput from "@/components/inputs/dateinput/ControlledDateInput";
import CheckInput from "@/components/inputs/CheckInput";
import { dateHelper } from "@/helpers/date/dateHelper";
import { useState } from "react";

const _rowsPerPage = 10;

interface Props {
    isDisabled: boolean;
    control: Control<CurrencyEditValues>;
    register: UseFormRegister<CurrencyEditValues>;
    trigger: UseFormTrigger<CurrencyEditValues>;
}

export default function CurrencyEdit_Rates({
    isDisabled,
    control,
    register,
    trigger,
}: Props) {
    const [pageIndex, setPageIndex] = useState(0);

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "rates",
    });

    const startRowIndex = pageIndex * _rowsPerPage;
    const endRowIndex = startRowIndex + _rowsPerPage - 1;

    async function handleAdd() {
        if (await trigger(undefined, { shouldFocus: true })) {
            prepend({
                currencyRateId: null,
                startDate: dateHelper.now(),
                rate: null,
                bankOfCanada: false,
            });
        }
    }

    function handleDelete(index: number) {
        if (window.confirm("Are you sure to delete this rate?")) {
            remove(index);
        }
    }

    async function handleGoToPage(pageIndex: number) {
        if (await trigger(undefined, { shouldFocus: true })) {
            setPageIndex(pageIndex);
        }
    }

    return (
        <div className="w-[34rem]">
            <FormTitle>Currency Rate</FormTitle>

            <Button
                variant="add"
                className="mb-3"
                onClick={handleAdd}
            >
                Add Rate
            </Button>

            <Grid
                columns={[
                    {},
                    { className: "text-start", title: "Start Date" },
                    { className: "text-start", title: "Rate" },
                    { className: "text-center", title: "Bank of Canada" },
                ]}
                pageIndex={pageIndex}
                rowsPerPage={_rowsPerPage}
                totalRowCount={fields.length}
                hidePagingDescription={true}
                onGoToPage={handleGoToPage}
            >
                {fields.length > 0 &&
                    fields
                        .filter((_, index) => index >= startRowIndex && index <= endRowIndex)
                        .map((field, index) => (
                            <tr key={field.id}>
                                <td className="align-middle">
                                    <IconButton
                                        icon="x-mark"
                                        title="Delete"
                                        onClick={() => handleDelete(index + startRowIndex)}
                                    />
                                </td>
                                <td>
                                    <ControlledDateInput
                                        control={control}
                                        name={`rates.${index + startRowIndex}.startDate`}
                                        className="w-40"
                                        required
                                        readOnly={isDisabled}
                                    />
                                </td>
                                <td>
                                    <ControlledDecimalInput
                                        control={control}
                                        name={`rates.${index + startRowIndex}.rate`}
                                        className="w-40"
                                        required
                                        readOnly={isDisabled}
                                        digits={4}
                                    />
                                </td>
                                <td className="align-middle">
                                    <div className="flex justify-center">
                                        <CheckInput
                                            {...register(`rates.${index + startRowIndex}.bankOfCanada`)}
                                            disabled={isDisabled}
                                        />
                                    </div>
                                </td>
                            </tr>
                ))}
                {fields.length === 0 && (
                    <tr>
                        <td colSpan={4}><i>No Data</i></td>
                    </tr>
                )}
            </Grid>
        </div>
    );
}