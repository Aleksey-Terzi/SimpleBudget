import { useForm } from "react-hook-form";
import { useSearch } from "@/components/search/Search";
import SearchCriteria from "@/components/search/SearchCriteria";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import SearchCriteriaButtons from "@/components/search/SearchCriteriaButtons";
import { PaymentCriteria } from "./PaymentCriteria";
import ControlledDateInput from "@/components/inputs/dateinput/ControlledDateInput";
import ControlledDecimalInput from "@/components/inputs/numeric/ControlledDecimalInput";

export default function PaymentSearch_Criteria() {
    const { criteria, defaultCriteria, isLoading, setCriteria } = useSearch<PaymentCriteria, object>();

    const { register, control, handleSubmit, reset, setFocus } = useForm<PaymentCriteria>({
        defaultValues: criteria
    });

    return (
        <SearchCriteria
            excludeFilterPropsInCount={["id", "type"]}
            onShow={() => setFocus("keyword")}
        >
            <form
                autoComplete="off"
                onSubmit={handleSubmit(v => setCriteria({...v, type: criteria.type, id: null}))}
                className="max-w-[48rem]"
            >
                <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                        <FormField label="Keyword">
                            <TextInput
                                {...register("keyword")}
                                maxLength={20}
                                readOnly={isLoading}
                            />
                        </FormField>
                        <FormField label="Date Range">
                            <div className="flex gap-2 items-center">
                                <ControlledDateInput
                                    control={control}
                                    name="dateFrom"
                                    placeholder="MM/dd/yyyy"
                                    readOnly={isLoading}
                                />
                                to
                                <ControlledDateInput
                                    control={control}
                                    name="dateThru"
                                    placeholder="MM/dd/yyyy"
                                    readOnly={isLoading}
                                />
                            </div>
                        </FormField>
                        <FormField label="Amount Range">
                            <div className="flex gap-2 items-center">
                                <ControlledDecimalInput
                                    control={control}
                                    name="amountFrom"
                                    className="w-full"
                                    readOnly={isLoading}
                                />
                                to
                                <ControlledDecimalInput
                                    control={control}
                                    name="amountThru"
                                    className="w-full"
                                    readOnly={isLoading}
                                />
                            </div>
                        </FormField>
                    </div>
                    <div>
                        <FormField label="Company">
                            <TextInput
                                {...register("company")}
                                maxLength={20}
                                readOnly={isLoading}
                            />
                        </FormField>
                        <FormField label="Category">
                            <TextInput
                                {...register("category")}
                                maxLength={20}
                                readOnly={isLoading}
                            />
                        </FormField>
                        <FormField label="Wallet">
                            <TextInput
                                {...register("wallet")}
                                maxLength={20}
                                readOnly={isLoading}
                            />
                        </FormField>
                    </div>
                </div>

                <SearchCriteriaButtons isLoading={isLoading} onClear={() => reset(defaultCriteria)} />
            </form>
        </SearchCriteria>
    );
}