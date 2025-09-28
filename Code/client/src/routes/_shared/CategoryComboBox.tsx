import { cache } from "@/cache/cache";
import ControlledComboBox, { ControlledComboBoxProps } from "@/components/inputs/combobox/ControlledComboBox";

type Props<Criteria extends object> = Omit<ControlledComboBoxProps<Criteria>, "allowCustomValue" | "items">;

export default function CategoryComboBox<Criteria extends object>({
    height,
    ...comboBoxProps
}: Props<Criteria>) {
    if (height === undefined) {
        height = 250;
    }
    return (
        <ControlledComboBox
            items={() => cache.selector.getCategories(false)}
            height={height}
            {...comboBoxProps}
        />
    )
}