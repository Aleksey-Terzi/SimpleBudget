import { ChangeEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { SuggestedPaymentModel } from "@/api/models/SuggestedPaymentModel";
import Button from "@/components/Button";
import FormField from "@/components/form/FormField";
import Grid from "@/components/Grid";
import CheckInput from "@/components/inputs/CheckInput";
import WalletComboBox from "@/routes/_shared/WalletComboBox";
import { PaymentImportValues } from "./_models/PaymentImportValues";
import PaymentImport_GridRow from "./PaymentImport_GridRow";
import { NewImportModel } from "@/api/models/NewImportModel";
import { comboBoxEmptyValue } from "@/components/inputs/combobox/ComboBoxValue";

interface Props {
    format: string;
    payments: SuggestedPaymentModel[];
    isSaving: boolean;
    onSave: (model: NewImportModel) => void;
}

export default function PaymentImport_Grid({ format, payments, isSaving, onSave }: Props) {
    const { register, control, handleSubmit, formState: { errors } } = useForm<PaymentImportValues>({
        defaultValues: {
            walletName: comboBoxEmptyValue,
            payments: payments.map(({ category, company }) => ({
                categoryName: { type: "selected", value: category ?? null },
                companyName: { type: "selected", value: company ?? null },
                description: "",
            })),
        }
    });
    const { fields } = useFieldArray({
        name: "payments",
        control
    });

    function handleSelectAll(e: ChangeEvent<HTMLInputElement>) {
        document.querySelectorAll("table.import-table tr td input[type=checkbox]")
            .forEach((chk) => {
                (chk as HTMLInputElement).checked = e.target.checked;
            });
    }

    return (
        <form onSubmit={handleSubmit(values => onSave(toModel(values, payments)))}>
            <FormField label="Import to Wallet" required className="mt-3">
                <WalletComboBox
                    control={control}
                    name="walletName"
                    required={true}
                    className="max-w-96"
                />
            </FormField>
            <FormField label="Loaded Payments">
                <Grid
                    columns={[
                        { title: <CheckInput defaultSelected={true} onChange={handleSelectAll} /> },
                        { className: "text-start", title: "Date" },
                        { className: "text-start", title: "Text" },
                        { className: "text-end", title: "Amount" },
                        { className: "text-start", title: "Company" },
                        { className: "text-start", title: "Category" },
                        { className: "text-start", title: "Description" },
                    ]}
                    className="import-table"
                >
                    {fields.map((field, index) => (
                        <PaymentImport_GridRow
                            key={field.id}
                            format={format}
                            index={index}
                            model={payments[index]}
                            register={register}
                            control={control}
                            descriptionError={errors?.payments?.[index]?.description}
                        />
                    ))}
                </Grid>
            </FormField>
            <div className="flex gap-1 mt-6">
                <Button
                    variant="submit"
                    isLoading={isSaving}
                    loadingText="Importing..."
                >
                    Import
                </Button>
                <Button
                    variant="cancel"
                    disabled={isSaving}
                    href="/budget/payments"
                />
            </div>
        </form>
    )
}

function toModel(values: PaymentImportValues, suggestedPayments: SuggestedPaymentModel[]): NewImportModel {
    const selected: number[] = [];

    document.querySelectorAll("table.import-table tr td input[type=checkbox]")
        .forEach((chk, index) => {
            if ((chk as HTMLInputElement).checked) {
                selected.push(index);
            }
        });

    return {
        wallet: values.walletName.value!,
        payments: values.payments
            .map((p, index) => ({...p, index}))
            .filter(({ index }) => selected.includes(index))
            .map(({ index, categoryName, companyName, description }) => {
                const { code, date, value } = suggestedPayments[index];
                return {
                    code,
                    date,
                    category: categoryName.value,
                    company: companyName.value,
                    value,
                    description
                }
            })
    }
}