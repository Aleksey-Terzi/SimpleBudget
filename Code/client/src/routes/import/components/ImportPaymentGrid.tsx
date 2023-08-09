import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FieldValues, UseFormReturn } from "react-hook-form";
import SearchSelector from "../../../components/SearchSelector";
import dateHelper from "../../../utils/dateHelper";
import numberHelper from "../../../utils/numberHelper";
import { SuggestedPaymentModel } from "../models/suggestedPaymentModel";

interface Props {
    valueFormat: string;
    payments: SuggestedPaymentModel[];
    companies: string[];
    categories: string[];
    formSettings: UseFormReturn<FieldValues, any>,
    saving: boolean;
}

export default function ImportPaymentGrid(props: Props) {
    const [paymentCount, setPaymentCount] = useState(0);

    const { register } = props.formSettings;

    useEffect(() => {
        setPaymentCount(props.payments.length);
    }, [props.payments]);

    function onSelectAll(e: any) {
        const checked = e.target.checked;

        for (let i = 0; i < paymentCount; i++) {
            props.formSettings.setValue(`selected.${i}`, checked);
        }
    }

    return (
        <>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>
                            <Form.Check
                                type="checkbox"
                                defaultChecked={true}
                                disabled={props.saving}
                                onChange={onSelectAll}
                            />
                        </th>
                        <th>Date</th>
                        <th>Text</th>
                        <th className="text-end">Value</th>
                        <th>Company</th>
                        <th>Category</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {!props.saving && props.payments && props.payments.map((p, index) => (
                        <tr key={index}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    defaultChecked={true}
                                    disabled={props.saving}
                                    {...register(`selected.${index}`)}
                                />
                            </td>
                            <td className="text-nowrap">
                                {dateHelper.formatDate(p.date)}
                            </td>
                            <td>
                                {p.name}
                                <div>
                                    <small>
                                        {p.code}
                                    </small>
                                </div>
                            </td>
                            <td className="text-end">
                                {numberHelper.formatCurrency(p.value, props.valueFormat)}
                            </td>
                            <td>
                                <SearchSelector
                                    items={props.companies}
                                    defaultValue={p.company}
                                    disabled={props.saving}
                                    maxLength={100}
                                    {...register(`company.${index}`)}
                                />
                            </td>
                            <td>
                                <SearchSelector
                                    items={props.categories}
                                    defaultValue={p.category}
                                    disabled={props.saving}
                                    maxLength={50}
                                    {...register(`category.${index}`)}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="text"
                                    disabled={props.saving}
                                    maxLength={100}
                                    {...register(`description.${index}`)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}