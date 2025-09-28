import { cache } from "@/cache/cache";
import ControlledComboBox, { ControlledComboBoxProps } from "@/components/inputs/combobox/ControlledComboBox";
import { ComboBoxItem } from "@/components/inputs/combobox/ComboBoxItem";

type Props<Criteria extends object> = Omit<ControlledComboBoxProps<Criteria>, "allowCustomValue" | "items">;

export default function ProductComboBox<Criteria extends object>({
    height,
    ...rest
}: Props<Criteria>) {
    if (height === undefined) {
        height = 250;
    }
    return (
        <ControlledComboBox
            items={load}
            height={height}
            {...rest}
        />
    )
}

function load(): ComboBoxItem[] | Promise<ComboBoxItem[]> {
    const result = cache.selector.getProducts();
    if (Array.isArray(result)) {
        return result.map(x => ({
            value: x.productName,
            text: x.productName,
        }));
    }

    return result
        .then(result => result.map(x => ({
            value: x.productName,
            text: x.productName,
        })));
}