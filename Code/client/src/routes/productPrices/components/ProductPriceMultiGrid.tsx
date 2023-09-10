import { Button, Form, Stack } from "react-bootstrap";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ProductPriceMultiFormValues } from "../models/productPriceMultiFormValues";
import SearchSelector from "../../../components/SearchSelector";
import { ProductSelectorModel } from "../../products/models/productSelectorModel";
import validatorHelper2 from "../../../utils/validatorHelper2";

interface Props {
    products: ProductSelectorModel[];
    form: UseFormReturn<ProductPriceMultiFormValues>;
    saving: boolean;
}

export default function ProductPriceMultiGrid(props: Props) {
    const { getValues, register, control, formState: { errors } } = props.form;

    const { fields, append, remove } = useFieldArray({
        name: "prices",
        control
    });

    let priceWasAdded = false;

    function addPrice() {
        if (priceWasAdded) {
            return;
        }

        priceWasAdded = true;

        append({
            productName: "",
            quantity: "",
            price: "",
            isDiscount: false,
            description: ""
        }, {
            shouldFocus: false
        });
    }

    function onDeletePrice(index: number) {
        if (hasValues(index)
            && !window.confirm("Are you sure to delete this price?")
        ) {
            return;
        }

        remove(index);
    }

    function hasValues(index: number) {
        const values = getValues(`prices.${index}`);
        return values.productName || values.price || values.isDiscount || values.description;
    }

    return (
        <>
            <Button
                variant="secondary"
                className="mb-3"
                onClick={addPrice}
            >
                <i className="bi-plus-circle me-1"></i>
                Add Price
            </Button>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map((field, index) => (
                        <tr key={field.id}>
                            <td>
                                <SearchSelector
                                    items={props.products?.map(p => p.productName)}
                                    disabled={props.saving}
                                    maxLength={100}
                                    isInvalid={!!errors.prices?.[index]?.productName}
                                    title={errors.prices?.[index]?.productName?.message as string}
                                    onInput={index === fields.length - 1 ? addPrice : undefined}
                                    {...register(`prices.${index}.productName`, {
                                        validate: (value: string) => {
                                            return hasValues(index) && !value ? "The product is a required field" : undefined;
                                        },
                                        onChange: index === fields.length - 1 ? addPrice : undefined
                                    })}
                                />
                            </td>
                            <td style={{width: "200px"}}>
                                <Stack direction="horizontal">
                                    <Form.Control
                                        type="text"
                                        maxLength={20}
                                        disabled={props.saving}
                                        isInvalid={!!errors.prices?.[index]?.price}
                                        title={errors.prices?.[index]?.price?.message as string}
                                        onInput={index === fields.length - 1 ? addPrice : undefined}
                                        {...register(`prices.${index}.price`, {
                                            validate: {
                                                requiredValidator: (value: string) => {
                                                    return hasValues(index) && !value ? "The price is a required field" : undefined;
                                                },
                                                moneyValidator: validatorHelper2.moneyValidator
                                            }
                                        })}
                                    />

                                    <Form.Check
                                        id={`prices.${index}.isDiscount`}
                                        className="ms-2"
                                        label="Discount"
                                        disabled={props.saving}
                                        tabIndex={-1}
                                        {...register(`prices.${index}.isDiscount`, {
                                            onChange: index === fields.length - 1 ? addPrice : undefined
                                        })}
                                    />
                                </Stack>
                            </td>
                            <td style={{ width: "100px" }}>
                                <Form.Control
                                    type="text"
                                    disabled={props.saving}
                                    maxLength={100}
                                    isInvalid={!!errors.prices?.[index]?.quantity}
                                    title={errors.prices?.[index]?.quantity?.message as string}
                                    onInput={index === fields.length - 1 ? addPrice : undefined}
                                    {...register(`prices.${index}.quantity`, {
                                        validate: validatorHelper2.integerValidator
                                    })}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="text"
                                    disabled={props.saving}
                                    maxLength={100}
                                    onInput={index === fields.length - 1 ? addPrice : undefined}
                                    {...register(`prices.${index}.description`)}
                                />
                            </td>
                            <td className="text-end" style={{width: "50px"}}>
                                {fields.length > 1 && (
                                    <Button
                                        variant="link"
                                        title="Delete"
                                        className="p-1"
                                        disabled={props.saving}
                                        tabIndex={-1}
                                        onClick={() => onDeletePrice(index)}
                                    >
                                        <i className="bi-x-lg"></i>
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}