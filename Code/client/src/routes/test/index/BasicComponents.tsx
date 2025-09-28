import Button from "@/components/Button";
import CheckInput from "@/components/inputs/CheckInput";
import ControlledComboBox from "@/components/inputs/combobox/ControlledComboBox";
import { ComboBoxItem } from "@/components/inputs/combobox/ComboBoxItem";
import DateInput from "@/components/inputs/dateinput/DateInput";
import LoadingProvider from "@/contexts/LoadingProvider";
import DecimalInput from "@/components/inputs/numeric/DecimalInput";
import RadioInput from "@/components/inputs/RadioInput";
import TextInput from "@/components/inputs/TextInput";
import FormField from "@/components/form/FormField";
import FormSection from "@/components/form/FormSection";
import FormTitle from "@/components/form/FormTitle";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/contexts/ToastProvider";
import { dateHelper } from "@/helpers/date/dateHelper";
import { ComboBoxValue } from "@/components/inputs/combobox/ComboBoxValue";
import ControlledDateInput from "@/components/inputs/dateinput/ControlledDateInput";
import { DateParts, InvalidDate } from "@/helpers/date/dateTypes";
import ControlledDecimalInput from "@/components/inputs/numeric/ControlledDecimalInput";

const _items: ComboBoxItem[] = [];
for (let i = 0; i < 15; i++) {
    _items.push({ value: `${i + 1}`, text: `Option ${i + 1}` });
}

let _toastCounter = 1;

interface FormValues {
    date1: DateParts | InvalidDate | null;
    combo1: ComboBoxValue;
    combo2: ComboBoxValue;
    combo3: ComboBoxValue;
    email: string;
    amount: number | null;
    amountReadOnly: number | null;
    amountDisabled: number | null;
    check1: boolean;
    radio1: string;
}

export default function BasicComponents() {
    const [isLoading, setIsLoading] = useState(false);

    const { register, control, handleSubmit: handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
        defaultValues: {
            date1: dateHelper.parse("03-25-2025"),
            combo1: { value: "11", type: "selected" },
            combo2: { value: "4", type: "selected" },
            combo3: { value: "5", type: "selected" },
            amount: 0,
            amountReadOnly: 1999900,
            amountDisabled: 205500,
            check1: true,
            radio1: "value2",
            email: "aaa@aaa.com",
        }
    });

    const { showToast, clearToasts } = useToast();

    function handleValidSubmit(values: FormValues) {
        console.log(values);
    }

    return (
        <FormSection className="h-full">
            <form autoComplete="off" onSubmit={handleSubmit(handleValidSubmit)}>
                <LoadingProvider>
                    <FormTitle>This is a form</FormTitle>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <FormField label="Email" description="Enter an email for us to contact you about your order." required>
                                <TextInput
                                    {...register("email", {
                                        required: true
                                    })}
                                    placeholder="Please enter email"
                                    error={errors.email}
                                />
                            </FormField>

                            <FormField label="Email (readonly)">
                                <TextInput name="EmailReadOnly" readOnly defaultValue="ttt@ttt.com" />
                            </FormField>

                            <FormField label="Email (disabled)">
                                <TextInput name="EmailDisabled" disabled />
                            </FormField>

                            <FormField>
                                <CheckInput {...register("check1")}>
                                    Click this!
                                </CheckInput>
                            </FormField>

                            <FormField>
                                <CheckInput name="Check2" disabled defaultSelected={true}>
                                    Disabled checkbox
                                </CheckInput>
                            </FormField>

                            <div className="grid grid-cols-3 gap-2">
                                <FormField label="Amount (readonly)">
                                    <ControlledDecimalInput
                                        control={control}
                                        name="amountReadOnly"
                                        readOnly
                                    />
                                </FormField>

                                <FormField label="Amount (disabled)">
                                    <ControlledDecimalInput
                                        control={control}
                                        name="amountDisabled"
                                        disabled
                                    />
                                </FormField>

                                <FormField label="Amount" required>
                                    <ControlledDecimalInput
                                        control={control}
                                        name="amount"
                                        required
                                        showDollarSign
                                        placeholder="Enter amount"
                                    />
                                </FormField>

                                <FormField label="Amount (test)">
                                    <DecimalInput defaultValue={123400} showDollarSign={false} />
                                </FormField>
                            </div>

                            <FormField label="Select Value">
                                <div className="flex gap-2">
                                    <RadioInput {...register("radio1")} value="value1">
                                        Value 1
                                    </RadioInput>
                                    <RadioInput {...register("radio1")} value="value2">
                                        Value 2
                                    </RadioInput>
                                </div>
                            </FormField>
                        </div>
                        <div>
                            <FormField label="Combobox">
                                <ControlledComboBox
                                    control={control}
                                    name="combo1"
                                    required={true}
                                    allowCustomValue={false}
                                    items={_items}
                                    height={200}
                                />
                            </FormField>

                            <FormField label="Combobox (Remote Loading)">
                                <ControlledComboBox
                                    control={control}
                                    name="combo2"
                                    required={true}
                                    // items={() => new Promise(resolve => setTimeout(() => resolve(_items), 2000))}
                                    items={() => Promise.resolve(_items)}
                                    // items={() => Promise.reject("Test combobox error")}
                                    height={200}
                                />
                            </FormField>

                            <FormField label="Combobox (OnlySelect)">
                                <ControlledComboBox
                                    control={control}
                                    name="combo3"
                                    onlySelect={true}
                                    // items={() => new Promise(resolve => setTimeout(() => resolve(_items), 5000))}
                                    items={_items}
                                    height={200}
                                />
                            </FormField>

                            <div className="grid grid-cols-3 gap-2">
                                <FormField label="Date Input">
                                    <ControlledDateInput
                                        control={control}
                                        name="date1"
                                        required={true}
                                        placeholder="MM/dd/yyyy"
                                    />
                                </FormField>
                                <FormField label="ReadOnly">
                                    <DateInput defaultValue={dateHelper.parse("01/02/2003")} readOnly />
                                </FormField>
                                <FormField label="Input 2">
                                    <DateInput defaultValue={dateHelper.parse("12/15/2023")} />
                                </FormField>
                            </div>

                            <FormField label="Just text">
                                <TextInput />
                            </FormField>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <Button variant="submit" />
                            <Button variant="submit" onClick={() => {
                                setIsLoading(true);
                                new Promise(resolve => setTimeout(() => resolve(undefined), 2000))
                                    .then(() => {
                                        setIsLoading(false);
                                        document.querySelector("form")!.requestSubmit();
                                    });
                            }} isLoading={isLoading}
                            >
                                Long Submit
                            </Button>
                            <Button onClick={() => reset()}>Reset</Button>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    showToast(`Toast message ${_toastCounter++}`, "info")
                                }}
                            >
                                Add Info Toast
                            </Button>
                            <Button
                                onClick={() => {
                                    showToast(`Toast error ${_toastCounter++}`, "error")
                                }}
                            >
                                Add Error Toast
                            </Button>
                            <Button onClick={() => clearToasts()}>
                                Clear Toasts
                            </Button>
                        </div>
                    </div>
                </LoadingProvider>
            </form>
        </FormSection>
    )
}
