import { cache } from "@/cache/cache";
import ControlledComboBox, { ControlledComboBoxProps } from "@/components/inputs/combobox/ControlledComboBox";

type Props<Criteria extends object> = Omit<ControlledComboBoxProps<Criteria>, "allowCustomValue" | "items">;

export default function WalletComboBox<Criteria extends object>({
    height,
    ...rest
}: Props<Criteria>) {
    if (height === undefined) {
        height = 250;
    }
    return (
        <ControlledComboBox
            items={() => cache.selector.getWallets(false)}
            allowCustomValue={false}
            height={height}
            {...rest}
        />
    )
}