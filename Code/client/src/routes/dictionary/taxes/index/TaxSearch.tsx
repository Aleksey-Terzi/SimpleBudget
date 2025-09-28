import { useEffect } from "react";
import { restClient } from "@/api/restClient";
import { useMenuProvider } from "@/contexts/MenuProvider";
import { useDictionarySearch } from "@/hooks/useDictionarySearch";
import FormSection from "@/components/form/FormSection";
import TaxSearch_Grid from "./TaxSearch_Grid";

export default function TaxSearch() {
    const { model } = useDictionarySearch("dictionary-taxes", () => restClient.taxSettings.all());

    const { addMenu } = useMenuProvider();

    useEffect(() => {
        if (!model) {
            return;
        }

        const currentYear = new Date().getFullYear();

        if (model.items.find(x => x.year === currentYear)) {
            return;
        }

        addMenu({
            url: `/dictionary/taxes/${currentYear}?from=${currentYear - 1}`,
            text: `Add Settings for ${currentYear}`,
            icon: "plus-cricle"
        });
    }, [addMenu, model]);

    return (
        <FormSection>
            <TaxSearch_Grid items={model?.items} valueFormat={model?.valueFormat} />
        </FormSection>
    );
}