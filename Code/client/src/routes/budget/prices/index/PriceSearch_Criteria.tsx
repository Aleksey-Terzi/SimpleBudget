import { useForm } from "react-hook-form";
import { useSearch } from "@/components/search/Search";
import { PriceCriteria } from "./PriceCriteria";
import SearchCriteria from "@/components/search/SearchCriteria";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/inputs/TextInput";
import SearchCriteriaButtons from "@/components/search/SearchCriteriaButtons";

export default function PriceSearch_Criteria() {
    const { criteria, defaultCriteria, isLoading, setCriteria } = useSearch<PriceCriteria, object>();

    const { register, reset, setFocus, handleSubmit, formState: { errors } } = useForm<PriceCriteria>({
        defaultValues: criteria
    });

    return (
        <SearchCriteria
            excludeFilterPropsInCount={["id"]}
            onShow={() => setFocus("keyword")}
        >
            <form autoComplete="off" onSubmit={handleSubmit(v => setCriteria({...v, id: null}))}>
                <FormField label="Keyword">
                    <TextInput
                        {...register("keyword")}
                        maxLength={20}
                        readOnly={isLoading}
                        error={errors.keyword}
                    />
                </FormField>

                <SearchCriteriaButtons isLoading={isLoading} onClear={() => reset(defaultCriteria)} />
            </form>
        </SearchCriteria>
    );
}