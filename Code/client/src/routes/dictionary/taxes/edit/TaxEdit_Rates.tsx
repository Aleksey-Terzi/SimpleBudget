import { Control, useFieldArray } from "react-hook-form";
import { TaxEditValues } from "./TaxEditValues";
import FormTitle from "@/components/form/FormTitle";
import Grid from "@/components/Grid";
import ControlledDecimalInput from "@/components/inputs/numeric/ControlledDecimalInput";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";

interface Props {
    isDisabled: boolean;
    control: Control<TaxEditValues>;
    collectionName: "federalTaxRates" | "provincialTaxRates";
    title: string;
}

export default function TaxEdit_Rates({
    isDisabled,
    control,
    collectionName,
    title
}: Props) {
    const { fields, prepend, remove } = useFieldArray({
        control,
        name: collectionName,
    });

    function handleAdd() {
        prepend({
            rate: null,
            maxAmount: null
        });
    }

    function handleDelete(index: number) {
        if (window.confirm("Are you sure to delete this rate?")) {
            remove(index);
        }
    }

    return (
        <div>
            <FormTitle>{title}</FormTitle>

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
                    { className: "text-start", title: "Rate %" },
                    { className: "text-start", title: "Max Amount" },
                ]}
                className="[&_input]:w-48"
            >
                {fields.map((field, index) => (
                    <tr key={field.id}>
                        <td className="align-middle">
                            <IconButton
                                icon="x-mark"
                                title="Delete"
                                onClick={() => handleDelete(index)}
                            />
                        </td>
                        <td>
                            <ControlledDecimalInput
                                control={control}
                                name={`${collectionName}.${index}.rate`}
                                required
                                min={0}
                                max={100 * 10000}
                                readOnly={isDisabled}
                            />
                        </td>
                        <td>
                            <ControlledDecimalInput
                                control={control}
                                name={`${collectionName}.${index}.maxAmount`}
                                required
                                min={100}
                                readOnly={isDisabled}
                            />
                        </td>
                    </tr>
                ))}
            </Grid>
        </div>
    );
}