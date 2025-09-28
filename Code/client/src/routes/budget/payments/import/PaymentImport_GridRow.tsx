import { Control, FieldError, UseFormRegister } from "react-hook-form";
import { PaymentImportValues } from "./_models/PaymentImportValues";
import { SuggestedPaymentModel } from "@/api/models/SuggestedPaymentModel";
import CheckInput from "@/components/inputs/CheckInput";
import { dateHelper } from "@/helpers/date/dateHelper";
import { apiDateFormatType } from "@/api/restClient";
import AmountField from "@/components/fields/AmountField";
import CompanyComboBox from "@/routes/_shared/CompanyComboBox";
import CategoryComboBox from "@/routes/_shared/CategoryComboBox";
import TextInput from "@/components/inputs/TextInput";
import { numberHelper } from "@/helpers/numberHelper";

interface Props {
    format: string;
    index: number,
    model: SuggestedPaymentModel;
    register: UseFormRegister<PaymentImportValues>;
    control: Control<PaymentImportValues>,
    descriptionError?: FieldError;
}

export default function PaymentImport_GridRow({ format, index, model, register, control, descriptionError }: Props) {
    const { code, name, date, value } = model;

    return (
        <tr>
            <td>
                <CheckInput defaultSelected={true} />
            </td>
            <td className="text-nowrap">
                {dateHelper.format(dateHelper.parse(date, apiDateFormatType), "mmm d, yyyy")}
            </td>
            <td>
                {name}
                <div className="text-description-text text-xs">{code}</div>
            </td>
            <td className="text-end">
                <AmountField format={format} amount={numberHelper.fromServerDecimal(value)} />
            </td>
            <td>
                <CompanyComboBox
                    control={control}
                    name={`payments.${index}.companyName`}
                    maxLength={100}
                />
            </td>
            <td>
                <CategoryComboBox
                    control={control}
                    name={`payments.${index}.categoryName`}
                    maxLength={50}
                />
            </td>
            <td>
                <TextInput
                    className="w-full"
                    {...register(`payments.${index}.description`)}
                    maxLength={100}
                    error={descriptionError}
                />
            </td>
        </tr>
    );
}