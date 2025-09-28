import { cache } from "@/cache/cache";
import ControlledComboBox, { ControlledComboBoxProps } from "@/components/inputs/combobox/ControlledComboBox";

type Props<Criteria extends object> = Omit<ControlledComboBoxProps<Criteria>, "allowCustomValue" | "items">;

export default function WalletCurrencyComboBox<Criteria extends object>({
    height,
    ...rest
}: Props<Criteria>) {
    if (height === undefined) {
        height = 250;
    }
    return (
        <ControlledComboBox
            items={() => cache.walletSelector.getCurrencies(true)}
            allowCustomValue={false}
            height={height}
            {...rest}
        />
    )
}