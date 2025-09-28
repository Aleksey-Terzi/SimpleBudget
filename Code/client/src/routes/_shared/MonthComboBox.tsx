import ComboBox, { ComboBoxProps } from "@/components/inputs/combobox/ComboBox";
import { months } from "@/helpers/date/dateTypes";

type Props = Omit<ComboBoxProps, "onlySelect" | "items">;

const _items = months.map(({ number, name }) => ({
    value: String(number),
    text: name
})).reverse();

export default function MonthComboBox(props: Props) {
    return (
        <ComboBox
            {...props}
            onlySelect={true}
            items={_items}
        />
    )
}